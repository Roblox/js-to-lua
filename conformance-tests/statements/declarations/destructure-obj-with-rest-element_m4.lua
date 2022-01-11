local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Object = LuauPolyfill.Object
local foo, rest
do
	local ref = { foo = "bar", fizz = "buzz", fuzz = "jazz" }
	foo, rest = ref.foo, Object.assign({}, ref, { foo = Object.None })
end
