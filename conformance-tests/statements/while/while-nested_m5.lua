-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/while/while-nested_m5.js
local i = 0
while true do
	local j = 0
	while true do
		if
			j
			> 10 --[[ ROBLOX CHECK: operator '>' works only if either both arguments are strings or both are a number ]]
		then
			break
		end
		j += 1
	end
	if
		i
		> 10 --[[ ROBLOX CHECK: operator '>' works only if either both arguments are strings or both are a number ]]
	then
		break
	end
	i += 1
end
