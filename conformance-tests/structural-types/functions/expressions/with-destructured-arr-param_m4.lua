local function reduce(ref0)
	local foo, bar = table.unpack(ref0, 1, 2)
	return { foo = foo, bar = bar }
end
