-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/comments/copyright/jsdoc/license-tag/copyright-with-unknown-type-polyfill_m5.ts
--[[*
 * Utility functions for the foo package.
 * @module foo/util
 * @license MIT
 ]]
type unknown = any --[[ ROBLOX FIXME: adding `unknown` type alias to make it easier to use Luau unknown equivalent when supported ]]
local function foo(bar: unknown) end
