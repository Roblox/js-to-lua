-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/for-of/nested-for-of-statement_m5.js
local result = ""
for _, foo in fizz do
	for _, bar in buzz do
		result = tostring(result) .. ", " .. tostring(foo) .. ":" .. tostring(bar)
	end
end
