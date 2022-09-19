-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/structural-types/combined/spread-object-and-array-combined-within-array.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Array = LuauPolyfill.Array
local Object = LuauPolyfill.Object
local arr = Array.concat(
	{},
	{ 1, 2, Object.assign({}, { foo = "foo", bar = "bar" }, { fizz = "fizz", buzz = "buzz" }) },
	{ 4, 5 }
)
