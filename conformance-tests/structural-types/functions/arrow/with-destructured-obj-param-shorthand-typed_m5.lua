local function reduce(ref: Record<string, any>)
	local foo, bar = ref.foo, ref.bar
	return { foo, bar }
end
