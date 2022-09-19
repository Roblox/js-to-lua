-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/for-of/no-declaration-for-of-statement-with-object-pattern_m5.js
local result = ""
for _, ref in
	ipairs(baz) --[[ ROBLOX CHECK: check if 'baz' is an Array ]]
do
	foo, bar = ref.foo, ref.bar
	result = tostring(result) .. ", " .. tostring(foo)
	bar()
end
