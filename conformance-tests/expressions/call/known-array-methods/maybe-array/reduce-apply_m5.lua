-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/call/known-array-methods/maybe-array/reduce-apply_m5.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Array = LuauPolyfill.Array
Array.reduce(arr, table.unpack(args)) --[[ ROBLOX CHECK: check if 'arr' is an Array ]]
