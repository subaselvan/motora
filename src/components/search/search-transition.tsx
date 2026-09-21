"use client";

import { createContext, useCallback, useContext, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Filters live in the URL, not in component state.
 *
 * That choice buys two things a `useState` filter bar cannot: a filtered
 * view is a link somebody can send, and the results stay server-rendered —
 * so the page a crawler sees is the page a person sees.
 *
 * The cost is that every filter change is a navigation. `useTransition`
 * pays it: React keeps the current results on screen and interactive while
 * the server renders the next set, instead of blanking to a spinner. This
 * context exists only to share that pending flag between the controls
 * (which start the transition) and the results (which dim during it).
 */
type SearchNav = {
  isPending: boolean;
  navigate: (params: URLSearchParams) => void;
};

const SearchNavContext = createContext<SearchNav | null>(null);

export function SearchTransition({ children }: { children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  const navigate = useCallback(
    (params: URLSearchParams) => {
      const qs = params.toString();
      startTransition(() => {
        // replace, not push: a filter adjustment is a refinement of where
        // you already are. Pushing would bury the page you arrived from
        // under twenty history entries.
        //
        // scroll:false because the results are below the fold on mobile —
        // jumping to the top on every chip tap loses your place.
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [router, pathname],
  );

  return (
    <SearchNavContext.Provider value={{ isPending, navigate }}>
      {children}
    </SearchNavContext.Provider>
  );
}

export function useSearchNav(): SearchNav {
  const context = useContext(SearchNavContext);
  if (!context) {
    throw new Error("useSearchNav must be used inside <SearchTransition>");
  }
  return context;
}

/**
 * Wraps the server-rendered results. `children` is an RSC payload handed
 * down from the server page — it crosses this client boundary already
 * rendered, so putting the grid inside a client component costs no
 * client-side JavaScript for the cards themselves.
 */
export function ResultsFrame({ children }: { children: React.ReactNode }) {
  const { isPending } = useSearchNav();
  return (
    <div
      // aria-busy tells a screen reader the region is updating; the visual
      // dim tells everyone else. 60% rather than a spinner, because the
      // previous results staying legible is the point of the transition.
      aria-busy={isPending || undefined}
      data-pending={isPending || undefined}
      className="transition-opacity duration-[var(--duration-short)] ease-[var(--ease-base)] data-[pending]:opacity-60"
    >
      {children}
    </div>
  );
}
