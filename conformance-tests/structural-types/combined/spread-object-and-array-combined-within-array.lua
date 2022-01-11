local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Array = LuauPolyfill.Array
local Object = LuauPolyfill.Object
local arr = Array.concat(
	{},
	{ 1, 2, Object.assign({}, { foo = "foo", bar = "bar" }, { fizz = "fizz", buzz = "buzz" }) },
	{ 4, 5 }
)
