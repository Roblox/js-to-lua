local result = ""
for _, ref in
	ipairs(baz) --[[ ROBLOX CHECK: check if 'baz' is an Array ]]
do
	foo = table.unpack(ref, 1, 1)
	bar = table.unpack(table.unpack(ref, 2, 2), 1, 1)
	result = tostring(result) .. ", " .. tostring(foo)
	bar()
end
