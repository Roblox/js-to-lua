-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/for-of/declaration-for-of-statement-with-nested-array-pattern_m5.js
local result = ""
for _, ref in
	ipairs(baz) --[[ ROBLOX CHECK: check if 'baz' is an Array ]]
do
	local foo = ref[1]
	local bar = table.unpack(ref, 2, 2)[1]
	result = tostring(result) .. ", " .. tostring(foo)
	bar()
end
