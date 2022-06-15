local result = ""
for ref in bar do
	foo = ref
	result = tostring(result) .. ", " .. tostring(foo)
end
