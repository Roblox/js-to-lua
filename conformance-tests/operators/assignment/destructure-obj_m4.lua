-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/assignment/destructure-obj_m4.js
local foo, fizz, fuzz
do
	local ref = { foo = "bar", fizz = "buzz", fuzz = "jazz" }
	foo, fizz, fuzz = ref.foo, ref.fizz, ref.fuzz
end
