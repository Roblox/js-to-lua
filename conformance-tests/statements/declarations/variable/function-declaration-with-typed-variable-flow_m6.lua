-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/variable/function-declaration-with-typed-variable-flow_m6.js
local bar: (p1: string, p2: number) -> number
function bar(p1, p2): number
	return 1
end
local baz: (p1: string, p2: number, ...any) -> number
function baz(
	p1,
	p2,
	...: any --[[ ROBLOX CHECK: check correct type of elements. ]]
): number
	local rest = { ... }
	return 1
end
