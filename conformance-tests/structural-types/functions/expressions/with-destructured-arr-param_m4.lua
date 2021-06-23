local function reduce(ref)
	local foo, bar = table.unpack(ref)
	return {
		foo = foo,
		bar = bar,
	}
end
