local result = ""
for ref in baz do
	local foo, bar = table.unpack(ref, 1, 2)
	result = tostring(result) .. ", " .. tostring(foo)
	bar()
end
