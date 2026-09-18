import { AmbientField } from "@/components/ui/ambient-field";

/**
 * The page's single light source, fixed to the viewport so every section
 * scrolls through one continuous space rather than past a stack of
 * separately-lit boxes.
 *
 * Two layers, deliberately: the CSS field always renders, and the shader
 * paints over it on capable devices. Phones, low-memory devices and
 * reduced-motion users keep the CSS field, which is a finished background
 * in its own right rather than a fallback that looks like something
 * failed to load.
 */
export function AmbientBackdrop() {
  return (
    <div aria-hidden="true" className="ambient-field">
      <span className="emission-core" />
      <span className="emission-bounce" />
      <AmbientField />
      <span className="emission-grain" />
    </div>
  );
}
