/**
 * What the Suggested queue shows of Claude's suggestion for a record; pure, so the rule has its unit test.
 * @module web/studio/core/suggestion-view
 */

/**
 * Whether Claude's suggestion for a record is on screen: "none" (it has none), "hidden" until the reviewer asks for
 * it on that record, then "shown". A screening decision rests on the suggestion, so the reviewer reads the record
 * first (design rule H4a; a cognitive forcing order against automation bias, Buçinca et al. 2021).
 * @param {boolean} hasSuggestion @param {string|null} askedFor the record whose suggestion was asked for @param {string} recordId
 * @returns {"none"|"hidden"|"shown"}
 */
export const suggestionView = (hasSuggestion, askedFor, recordId) =>
  !hasSuggestion ? "none" : askedFor === recordId ? "shown" : "hidden";
