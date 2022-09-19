-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/for-in/nested-for-in-statement_m5.js
local result = ""
for foo in fizz do
	for bar in buzz do
		result = tostring(result) .. ", " .. tostring(foo) .. ":" .. tostring(bar)
	end
end
