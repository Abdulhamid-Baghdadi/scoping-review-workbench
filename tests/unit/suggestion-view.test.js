// Design rule H4a (design-rules 7615f26): where a decision rests on the AI's value, the reviewer reads the record
// before seeing it. Right results by definition of the rule, after Buçinca et al. (2021): a suggestion stays hidden
// until the reviewer asks for it on that record, and only a suggestion on screen can be accepted.
import { test } from "node:test";
import assert from "node:assert/strict";
import { suggestionView } from "../../web/studio/core/suggestion-view.js";

test("a record without a suggestion has none to show", () => {
  assert.equal(suggestionView(false, null, "R0001"), "none");
  assert.equal(suggestionView(false, "R0001", "R0001"), "none");
});

test("a suggestion is hidden until the reviewer asks for it on this record", () => {
  assert.equal(suggestionView(true, null, "R0001"), "hidden");
  assert.equal(suggestionView(true, "R0001", "R0001"), "shown");
});

test("asking on one record does not show the next record's suggestion", () => {
  assert.equal(suggestionView(true, "R0001", "R0002"), "hidden");
});
