-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/for-in/simple-for-in-statement-definitely-array_m5.js
local result = ""
for foo in { 1, 2, 3 } do
	result = tostring(result) .. ", " .. tostring(foo)
end
