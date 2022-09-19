-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/structural-types/object/spread-multiple-properties.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Object = LuauPolyfill.Object
local obj = Object.assign(
	{},
	{ foo = "foo", bar = "bar" },
	{ baz = "baz", bar = "another bar" },
	{ fizz = "fizz", buzz = "buzz" },
	{ fuzz = "fuzz", jazz = "jazz" }
)
