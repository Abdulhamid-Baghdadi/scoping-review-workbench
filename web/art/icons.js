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
  unlock: "M7 11h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1zM9 11V8a3 3 0 0 1 5.8-1",
  note: "M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6",
  pdf: "M6 3h8l4 4v14H6zM14 3v4h4M9 13h2.5a1.5 1.5 0 0 1 0 3H9v-3zm0 3v2",
  file: "M6 3h8l4 4v14H6zM14 3v4h4",
  table: "M4 5h16v14H4zM4 10h16M4 15h16M10 5v14",
  save: "M5 4h11l3 3v13H5zM8 4v5h7V4M8 20v-6h8v6",
  search: "M10.5 4a6.5 6.5 0 1 0 0 13a6.5 6.5 0 1 0 0-13zM15.5 15.5L20 20",
  library: "M5 4h3v16H5zM10 4h3v16h-3zM15.2 4.6l2.9-.8 4 15.4-2.9.8z",
  trash: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  package: "M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9",
  copy: "M9 4h6v3H9zM7 5.5H5V21h14V5.5h-2M8 12h8M8 16h5",
  idea: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z",
  pen: "M4 20l4-1L19 8l-3-3L5 16zM14 7l3 3",
  chart: "M4 20h16M7 20v-7M12 20V6M17 20v-10",
  user: "M12 4a4 4 0 1 0 0 8a4 4 0 1 0 0-8zM4 21a8 8 0 0 1 16 0",
  inbox: "M4 13l2.5-8h11L20 13v6H4zM4 13h5l1 2h4l1-2h5",
  done: "M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM8 12l3 3 5-6",
  warning: "M12 4l9 16H3zM12 10v4M12 17h.01",
  example: "M3 5h7a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H3zM21 5h-7a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h7z",
};

/** An icon as an inline <svg>, sized by CSS (.icon); "" for an unknown name. */
export const iconSvg = name => ICONS[name]
  ? `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${ICONS[name]}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  : "";
