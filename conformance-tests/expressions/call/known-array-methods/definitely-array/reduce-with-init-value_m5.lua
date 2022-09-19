-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/call/known-array-methods/definitely-array/reduce-with-init-value_m5.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Array = LuauPolyfill.Array
Array.reduce({ 1, 2, 3, 4, 5 }, function(a, b)
	return a + b
end, 0)
