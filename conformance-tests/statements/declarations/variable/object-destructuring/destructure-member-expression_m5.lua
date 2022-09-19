-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/variable/object-destructuring/destructure-member-expression_m5.js
local obj = { nested = { foo = "bar", fizz = "buzz", fuzz = "jazz" } }
local foo, fizz, fuzz
do
	local ref = obj.nested
	foo, fizz, fuzz = ref.foo, ref.fizz, ref.fuzz
end
