-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/flow-types/typeof/typeof-type-annotation-function-argument_m6.js
local bar = "string"
local function foo(arg: typeof(bar))
	return arg
end
