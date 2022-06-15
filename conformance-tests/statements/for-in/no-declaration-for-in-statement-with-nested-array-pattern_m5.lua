local result = ""
for ref in baz do
	foo = ref[1]
	bar = table.unpack(ref, 2, 2)[1]
	result = tostring(result) .. ", " .. tostring(foo)
	bar()
end
