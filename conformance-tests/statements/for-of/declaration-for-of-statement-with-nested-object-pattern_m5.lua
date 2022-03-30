local result = ""
for _, ref in
	ipairs(fizz) --[[ ROBLOX CHECK: check if 'fizz' is an Array ]]
do
	local foo, baz = ref.foo, ref.bar.baz
	result = tostring(result) .. ", " .. tostring(foo)
	baz()
end
