-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/variable/function-declaration-with-typed-variable_m5.ts
local foo: (p1: string, p2: number) -> ()
function foo(p1, p2): () end
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
