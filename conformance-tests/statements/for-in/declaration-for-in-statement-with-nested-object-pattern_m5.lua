-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/for-in/declaration-for-in-statement-with-nested-object-pattern_m5.js
local result = ""
for ref in fizz do
	local foo, baz = ref.foo, ref.bar.baz
	result = tostring(result) .. ", " .. tostring(foo)
	baz()
end
