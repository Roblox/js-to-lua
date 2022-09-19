-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/flow-types/null-literal-type-annotation-function-argument_m6.js
local function foo(
	arg: string | nil --[[ ROBLOX CHECK: verify if `null` wasn't used differently than `undefined` ]]
)
	return arg
end
