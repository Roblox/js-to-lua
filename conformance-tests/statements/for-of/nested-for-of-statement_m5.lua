local result = ""
for _, foo in
	ipairs(fizz) --[[ ROBLOX CHECK: check if 'fizz' is an Array ]]
do
	for _, bar in
		ipairs(buzz) --[[ ROBLOX CHECK: check if 'buzz' is an Array ]]
	do
		result = tostring(result) .. ", " .. tostring(foo) .. ":" .. tostring(bar)
	end
end
