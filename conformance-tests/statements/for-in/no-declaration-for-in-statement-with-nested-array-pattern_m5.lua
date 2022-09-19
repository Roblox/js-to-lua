-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/for-in/no-declaration-for-in-statement-with-nested-array-pattern_m5.js
local result = ""
for ref in baz do
	foo = ref[1]
	bar = table.unpack(ref, 2, 2)[1]
	result = tostring(result) .. ", " .. tostring(foo)
	bar()
end
