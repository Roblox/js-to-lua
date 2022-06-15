local result = ""
for ref in baz do
	foo, bar = ref.foo, ref.bar
	result = tostring(result) .. ", " .. tostring(foo)
	bar()
end
