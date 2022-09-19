-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/for-of/no-declaration-for-of-statement-with-identifier_m5.js
local result = ""
for _, ref in
	ipairs(bar) --[[ ROBLOX CHECK: check if 'bar' is an Array ]]
do
	foo = ref
	result = tostring(result) .. ", " .. tostring(foo)
end
