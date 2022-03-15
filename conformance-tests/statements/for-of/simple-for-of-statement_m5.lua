local result = ""
for _, foo in
	ipairs(bar) --[[ ROBLOX CHECK: check if 'bar' is an Array ]]
do
	result = tostring(result) .. ", " .. tostring(foo)
end
