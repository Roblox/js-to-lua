-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/variable/object-destructuring/destructure-call-expression_m5.js
local function func()
	return { foo = "bar", fizz = "buzz", fuzz = "jazz" }
end
local foo, fizz, fuzz
do
	local ref = func()
	foo, fizz, fuzz = ref.foo, ref.fizz, ref.fuzz
end
