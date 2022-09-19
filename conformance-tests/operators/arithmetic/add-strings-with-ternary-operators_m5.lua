-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/arithmetic/add-strings-with-ternary-operators_m5.js
local foo = "1"
	.. tostring(bar)
	.. (if sth == 1 then "2" else "3")
	.. (if sthElse == 2 then "4" else "5")
	.. tostring(6)
	.. tostring(concatenate(left, right))
