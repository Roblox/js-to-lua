-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/for-of/simple-for-of-statement-definitely-array_m5.js
local result = ""
for _, foo in ipairs({ 1, 2, 3 }) do
	result = tostring(result) .. ", " .. tostring(foo)
end
