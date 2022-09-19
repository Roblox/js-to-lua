-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/comments/copyright/jsdoc/copyright-tag/copyright-with-unknown-type-polyfill_m5.ts
--[[*
 * @file This is my cool script.
 * @copyright XYZ
 ]]
type unknown = any --[[ ROBLOX FIXME: adding `unknown` type alias to make it easier to use Luau unknown equivalent when supported ]]
local function foo(bar: unknown) end
