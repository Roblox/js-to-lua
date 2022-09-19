-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/for-of/declaration-for-of-statement-with-array-pattern_m5.js
local result = ""
for _, ref in
	ipairs(baz) --[[ ROBLOX CHECK: check if 'baz' is an Array ]]
do
	local foo, bar = table.unpack(ref, 1, 2)
	result = tostring(result) .. ", " .. tostring(foo)
	bar()
end
