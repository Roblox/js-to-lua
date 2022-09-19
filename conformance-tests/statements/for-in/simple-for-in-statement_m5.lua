-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/for-in/simple-for-in-statement_m5.js
local result = ""
for foo in bar do
	result = tostring(result) .. ", " .. tostring(foo)
end
