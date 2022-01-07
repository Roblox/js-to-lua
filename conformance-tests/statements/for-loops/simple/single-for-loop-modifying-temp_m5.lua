local i = 0
while
	i
	< 10 --[[ ROBLOX CHECK: operator '<' works only if either both arguments are strings or both are a number ]]
do
	foo(i)
	if i == 3 then
		i += 1
	end
	i += 1
end
