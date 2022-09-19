-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/for-in/declaration-for-in-statement-with-nested-array-pattern_m5.js
local result = ""
for ref in baz do
	local foo = ref[1]
	local bar = table.unpack(ref, 2, 2)[1]
	result = tostring(result) .. ", " .. tostring(foo)
	bar()
end
