"use client";

import { useEffect, useRef } from "react";

/**
 * Staggered text reveal — our own splitter rather than GSAP's paid
 * SplitText plugin.
 *
 * Three of the five reference sites use SplitText for exactly this
 * effect. The licensed plugin's real value is line-splitting and
 * re-splitting on resize, which is genuinely fiddly; this does the part
 * we actually need and sidesteps both the cost and the dependency.
 *
 * Words, not characters. Character splitting looks impressive in a demo
 * and reads badly in practice: it shreds a headline into confetti and
 * forces a screen reader through it one letter at a time. Words keep the
 * sentence a sentence.
 *
 * Accessibility: the original string stays in the DOM as an sr-only
 * node and the animated copy is aria-hidden, so assistive tech reads one
 * clean sentence rather than N fragments.
 */
export function SplitText({
  children,
  as: Tag = "span",
  className,
  style,
  stagger = 55,
  delay = 0,
}: {
  children: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  className?: string;
  style?: React.CSSProperties;
  /** ms between words. Past ~90 a long line finishes after it is read. */
  stagger?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.setAttribute("data-split-revealed", "");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        node.setAttribute("data-split-revealed", "");
        observer.disconnect();
      },
      { threshold: 0.2, rootMargin: "0px 0px -6% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const words = children.split(" ");

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={["split-text", className].filter(Boolean).join(" ")}
      style={style}
    >
      <span className="sr-only">{children}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          // The mask: each word rides up out of an overflow-hidden box,
          // so it appears to emerge from behind the line above rather
          // than simply fading in place.
          <span key={`${word}-${i}`} className="split-word">
            <span
              className="split-word-inner"
              style={{ transitionDelay: `${delay + i * stagger}ms` }}
            >
              {word}
            </span>
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    </Tag>
  );
}
