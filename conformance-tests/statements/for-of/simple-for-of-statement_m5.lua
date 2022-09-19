-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/for-of/simple-for-of-statement_m5.js
local result = ""
for _, foo in
	ipairs(bar) --[[ ROBLOX CHECK: check if 'bar' is an Array ]]
do
	result = tostring(result) .. ", " .. tostring(foo)
end
