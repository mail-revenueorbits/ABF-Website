import { useEffect, useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Scrolls to the top of the page on route change.
 *
 * Two things go wrong without this care:
 *   1. Browsers auto-restore scroll on history navigation. React Router
 *      treats `<Link>` clicks like pushState, which can trigger restoration
 *      to a stale Y position if the new page's height matches.
 *   2. `html { scroll-behavior: smooth }` in our index.css turns every
 *      `scrollTo` into an animated scroll, so if the user taps a nav link
 *      while near the bottom, the scroll is interrupted by the new page's
 *      render and lands mid-page or at the bottom.
 *
 * Fix: opt out of the browser's auto-restoration, run the reset in
 * `useLayoutEffect` (before paint), and pass `behavior: 'instant'` to
 * force a jump regardless of the smooth-scroll CSS.
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    // On back/forward, let the browser restore the previous scroll
    // naturally. On push navigations (link clicks), reset to the top.
    if (navType === 'POP') return;
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }
  }, [pathname, search, navType]);

  return null;
}
