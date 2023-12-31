-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/structural-types/combined/spread-object-and-array-combined-within-object.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Array = LuauPolyfill.Array
local Object = LuauPolyfill.Object
local obj = Object.assign(
	{},
	{ foo = "foo", bar = "bar" },
	{ fizz = "fizz", buzz = "buzz" },
	{ fuzz = Array.concat({}, { 1, 2 }, { 3, 4 }, { 5, 6, {} }, { 7, 8 }) }
)
