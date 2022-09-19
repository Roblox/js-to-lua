-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/for-in/no-declaration-for-in-statement-with-object-pattern_m5.js
local result = ""
for ref in baz do
	foo, bar = ref.foo, ref.bar
	result = tostring(result) .. ", " .. tostring(foo)
	bar()
end
