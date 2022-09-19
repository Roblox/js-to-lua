-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/for-loops/simple/continue/nested-for-loops_m5.js
for i = 0, 2 do
	if i == 1 then
		continue
	end
	foo(i)
	for j = 0, 4 do
		if j == 2 then
			continue
		end
		bar(i, j)
	end
end
