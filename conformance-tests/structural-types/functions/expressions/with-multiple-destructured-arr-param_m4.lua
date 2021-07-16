local function reduce(ref, ref_)
	local foo = table.unpack(ref, 1, 1)
	local bar = table.unpack(ref_, 1, 1)
	return { foo = foo, bar = bar }
end
