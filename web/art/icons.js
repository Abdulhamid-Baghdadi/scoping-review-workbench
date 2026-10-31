/**
 * The app's icons, drawn by us in place of emoji (which look different on every system): 24 × 24 line drawings in
 * the text's colour, stroke 2, round caps. An icon always stands beside its word, never instead of it, so each is
 * hidden from screen readers. SVG text, no imports.
 * @module web/art/icons
 */

export const ICONS = {
  timeline: "M12 4a8 8 0 1 0 0 16a8 8 0 1 0 0-16zM12 8v4l3 2",
  checklist: "M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM8 12l3 3 5-6",
  assist: "M11 3l1.8 5.2L18 10l-5.2 1.8L11 17l-1.8-5.2L4 10l5.2-1.8zM18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z",
  settings: "M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6zM12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1",
  folder: "M3 6h6l2 2h10v11H3z",
  glossary: "M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2zM5 18a2 2 0 0 1 2-2h11M9 8h5",
  keys: "M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10",
  theme: "M12 4a8 8 0 1 0 0 16a8 8 0 1 0 0-16zM12 4v16",
  install: "M12 4v10M8 10l4 4 4-4M5 19h14",
  download: "M4 9l2-4h12l2 4v10H4zM4 9h16M12 12v5M9.5 14.5L12 17l2.5-2.5",
  developer: "M14.5 5.5a4 4 0 0 0-5 5L4 16l4 4 5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-2.5-.5-.5-2.5z",
  lock: "M7 11h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1zM9 11V8a3 3 0 0 1 6 0v3",
  compass: "M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM15.5 8.5l-2 5-5 2 2-5z",
};

/** An icon as an inline <svg>, sized by CSS (.icon); "" for an unknown name. */
export const iconSvg = name => ICONS[name]
  ? `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${ICONS[name]}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  : "";
