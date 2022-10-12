-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/member/known-number-methods/valid-properties_m5.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Number = LuauPolyfill.Number
local foo
foo = Number.isFinite
foo = Number.isInteger
foo = Number.isNaN
foo = Number.isSafeInteger
foo = Number.parseFloat --[[ ROBLOX NOTE: Number.parseFloat is currently not supported by the Luau Number polyfill, please add your own implementation or file a ticket on the same ]]
foo = Number.parseInt --[[ ROBLOX NOTE: Number.parseInt is currently not supported by the Luau Number polyfill, please add your own implementation or file a ticket on the same ]]
foo = Number.NaN
foo = -math.huge
foo = math.huge
foo = Number.MAX_SAFE_INTEGER
foo = Number.MIN_SAFE_INTEGER
