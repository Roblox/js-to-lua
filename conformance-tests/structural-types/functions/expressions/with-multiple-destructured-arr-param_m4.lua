local function reduce(ref, ref_)
	local foo = table.unpack(ref)
	local bar = table.unpack(ref_)
	return {
		foo = foo,
		bar = bar,
	}
end
