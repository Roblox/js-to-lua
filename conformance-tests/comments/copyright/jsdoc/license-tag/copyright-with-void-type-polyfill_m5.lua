-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/comments/copyright/jsdoc/license-tag/copyright-with-void-type-polyfill_m5.ts
--[[*
 * Utility functions for the foo package.
 * @module foo/util
 * @license MIT
 ]]
type void = nil --[[ ROBLOX FIXME: adding `void` type alias to make it easier to use Luau `void` equivalent when supported ]]
local function foo(bar: Response<void>): () end
