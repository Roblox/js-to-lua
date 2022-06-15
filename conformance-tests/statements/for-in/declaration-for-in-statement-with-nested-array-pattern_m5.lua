local result = ""
for ref in baz do
	local foo = ref[1]
	local bar = table.unpack(ref, 2, 2)[1]
	result = tostring(result) .. ", " .. tostring(foo)
	bar()
end
