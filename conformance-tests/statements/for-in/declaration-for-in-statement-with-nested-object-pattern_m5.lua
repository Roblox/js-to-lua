local result = ""
for ref in fizz do
	local foo, baz = ref.foo, ref.bar.baz
	result = tostring(result) .. ", " .. tostring(foo)
	baz()
end
