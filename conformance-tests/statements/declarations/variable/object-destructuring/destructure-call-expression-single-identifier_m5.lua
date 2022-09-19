-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/variable/object-destructuring/destructure-call-expression-single-identifier_m5.js
local function func()
	return { foo = "bar", fizz = "buzz", fuzz = "jazz" }
end
local foo = func().foo
