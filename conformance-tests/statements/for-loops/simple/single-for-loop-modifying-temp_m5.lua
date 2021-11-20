local i = 0
while
	i
	< 10 --[[ ROBLOX CHECK: operator '<' works only if either both arguments are strings or both are a number ]]
do
	foo(i)
	if i == 3 then
		(function()
			local result = i
			i += 1
			return result
		end)()
	end
	(function()
		local result = i
		i += 1
		return result
	end)()
end
