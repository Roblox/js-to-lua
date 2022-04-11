local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Object = LuauPolyfill.Object
local obj = { foo = "bar", fizz = "buzz", fuzz = "jazz" }
local foo, fizz, fuzz
do
	local ref = Object.assign({}, obj)
	foo, fizz, fuzz = ref.foo, ref.fizz, ref.fuzz
end
