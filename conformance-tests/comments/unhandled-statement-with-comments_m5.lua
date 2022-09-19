-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/comments/unhandled-statement-with-comments_m5.js
-- some leading comment
error("not implemented") --[[ ROBLOX TODO: Unhandled node for type: ForOfStatement with await modifier ]] --[[ for await (const foo of bar) {
  loopOne();
} ]] -- some trailing comment
