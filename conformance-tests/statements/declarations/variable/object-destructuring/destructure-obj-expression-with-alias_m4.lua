local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Object = LuauPolyfill.Object
local obj = { foo = "bar", fizz = "buzz", fuzz = "jazz" }
local foo1, fizz1, fuzz
do
	local ref = Object.assign({}, obj)
	foo1, fizz1, fuzz = ref.foo, ref.fizz, ref.fuzz
end