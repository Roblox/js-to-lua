-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/arithmetic/add-with-ternary-operators_m5.js
local foo = 1
	+ bar
	+ (if sth == 1 then 2 else 3)
	+ (if sthElse == 2 then 4 else 5)
	+ 6
	+ add(left, right)
