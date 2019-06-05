/**
 * Returns whether the current page is a PWA
 */
export default function isPwa(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    !!navigator.standalone
  );
}
