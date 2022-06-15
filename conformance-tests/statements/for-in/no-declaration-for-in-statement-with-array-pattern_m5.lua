local result = ""
for ref in baz do
	foo, bar = table.unpack(ref, 1, 2)
	result = tostring(result) .. ", " .. tostring(foo)
	bar()
end
