-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/structural-types/functions/arrow/with-multiple-destructured-obj-param-and-default-values-typed_m5.ts
local fizz, fuzz
local function reduce(ref0_: { foo: string }?, ref1_: Array<number>?)
	local ref0: { foo: string } = if ref0_ ~= nil then ref0_ else fizz
	local foo = ref0.foo
	local ref1: Array<number> = if ref1_ ~= nil then ref1_ else fuzz
	local bar = ref1[1]
	return { foo, bar }
end
