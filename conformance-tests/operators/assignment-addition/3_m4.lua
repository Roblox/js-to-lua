-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/assignment-addition/3_m4.js
local a = 1
local function foo()
	a ..= "foo"
	return a
end
