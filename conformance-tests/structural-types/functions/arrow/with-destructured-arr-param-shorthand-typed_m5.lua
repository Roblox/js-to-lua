local function reduce(ref: Array<number>)
	local foo, bar = table.unpack(ref, 1, 2)
	return { foo = foo, bar = bar }
end
