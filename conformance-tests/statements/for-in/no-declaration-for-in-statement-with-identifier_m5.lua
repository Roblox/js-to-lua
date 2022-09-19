-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/for-in/no-declaration-for-in-statement-with-identifier_m5.js
local result = ""
for ref in bar do
	foo = ref
	result = tostring(result) .. ", " .. tostring(foo)
end
