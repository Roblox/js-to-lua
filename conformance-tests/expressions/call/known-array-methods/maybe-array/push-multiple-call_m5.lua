-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/call/known-array-methods/maybe-array/push-multiple-call_m5.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Array = LuauPolyfill.Array
Array.concat(arr, { 1, 2, 3 }) --[[ ROBLOX CHECK: check if 'arr' is an Array ]]
