-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/for-loops/simple/nested-for-loops-modifying_m5.js
do
	local i = 0
	while i < 3 do
		foo(i)
		if i == 3 then
			i += 1
		end
		do
			local j = 0
			while j < 5 do
				if i == j then
					j *= 2
				end
				bar(i, j)
				j = j + 1
			end
		end
		i = i + 1
	end
end
