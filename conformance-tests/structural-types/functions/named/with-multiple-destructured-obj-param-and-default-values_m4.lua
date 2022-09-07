local fizz, fuzz
local function reduce(ref0_: Object?, ref1_: Array<any>?)
	local ref0: Object = if ref0_ ~= nil then ref0_ else fizz
	local foo = ref0.foo
	local ref1: Array<any> = if ref1_ ~= nil then ref1_ else fuzz
	local bar = ref1[1]
	return { foo, bar }
end
