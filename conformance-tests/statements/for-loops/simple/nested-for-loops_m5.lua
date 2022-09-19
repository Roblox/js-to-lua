-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/for-loops/simple/nested-for-loops_m5.js
for i = 0, 2 do
	foo(i)
	for j = 0, 4 do
		bar(i, j)
	end
end
