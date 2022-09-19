-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/comments/copyright/jsdoc/copyright-tag/copyright-with-void-type-polyfill_m5.ts
--[[*
 * @file This is my cool script.
 * @copyright XYZ
 ]]
type void = nil --[[ ROBLOX FIXME: adding `void` type alias to make it easier to use Luau `void` equivalent when supported ]]
local function foo(bar: Response<void>): () end
