-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/flow-types/string-literal-type-annotation/function-argument_m6.js
local function foo(arg: "foo" | "bar")
	return arg
end
