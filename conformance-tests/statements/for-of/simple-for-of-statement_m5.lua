-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/for-of/simple-for-of-statement_m5.js
local result = ""
for _, foo in bar do
	result = tostring(result) .. ", " .. tostring(foo)
end
