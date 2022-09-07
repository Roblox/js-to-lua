local function reduce(ref0: Record<string, any>)
	local foo, bar = ref0.foo, ref0.bar
	return { foo, bar }
end
