local result = ""
for _, ref in
	ipairs(bar) --[[ ROBLOX CHECK: check if 'bar' is an Array ]]
do
	foo = ref
	result = tostring(result) .. ", " .. tostring(foo)
end
