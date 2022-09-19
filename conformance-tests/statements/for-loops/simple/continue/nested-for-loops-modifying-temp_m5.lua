-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/for-loops/simple/continue/nested-for-loops-modifying-temp_m5.js
do
	local i = 0
	while
		i
		< 10 --[[ ROBLOX CHECK: operator '<' works only if either both arguments are strings or both are a number ]]
	do
		foo(i)
		if i == 3 then
			i += 2
			i += 1
			continue
		end
		do
			local j = 0
			while
				j
				< 10 --[[ ROBLOX CHECK: operator '<' works only if either both arguments are strings or both are a number ]]
			do
				if i == j then
					j *= 2
					j += 1
					continue
				end
				bar(i, j)
				j += 1
			end
		end
		i += 1
	end
end
