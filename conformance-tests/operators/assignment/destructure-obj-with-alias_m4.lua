-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/assignment/destructure-obj-with-alias_m4.js
local foo1, fizz1, fuzz
do
	local ref = { foo = "bar", fizz = "buzz", fuzz = "jazz" }
	foo1, fizz1, fuzz = ref.foo, ref.fizz, ref.fuzz
end
