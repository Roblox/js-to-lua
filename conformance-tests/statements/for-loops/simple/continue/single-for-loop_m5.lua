-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/for-loops/simple/continue/single-for-loop_m5.js
for i = 0, 9 do
	if i == 2 then
		continue
	end
	foo(i)
end
