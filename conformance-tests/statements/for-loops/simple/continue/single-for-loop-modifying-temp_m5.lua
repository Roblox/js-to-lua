-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/for-loops/simple/continue/single-for-loop-modifying-temp_m5.js
do
	local i = 0
	while
		i
		< 10 --[[ ROBLOX CHECK: operator '<' works only if either both arguments are strings or both are a number ]]
	do
		if i == 3 then
			i += 2
			i += 1
			continue
		end
		foo(i)
		i += 1
	end
end
