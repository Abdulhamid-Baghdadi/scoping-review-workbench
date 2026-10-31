/**
 * A phase of the review as its picture (web/art/phase-pictures.js, shared with the start screen).
 * @module web/studio/ui/phase-picture
 */
import { h } from "../core/dom.js";
import { phasePictureSvg } from "../../art/phase-pictures.js";

/** The picture of a phase ("Plan", "Find" …) as an <svg> element with its alt text; null for a phase without one. */
export const phasePicture = phase => h("span", { html: phasePictureSvg(phase) }).firstElementChild;
