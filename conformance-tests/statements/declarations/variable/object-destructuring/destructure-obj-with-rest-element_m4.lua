-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/variable/object-destructuring/destructure-obj-with-rest-element_m4.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Object = LuauPolyfill.Object
local foo, rest
do
	local ref = { foo = "bar", fizz = "buzz", fuzz = "jazz" }
	foo, rest = ref.foo, Object.assign({}, ref, { foo = Object.None })
end
