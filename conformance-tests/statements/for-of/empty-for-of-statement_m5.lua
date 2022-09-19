-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/for-of/empty-for-of-statement_m5.js
for _, foo in
	ipairs(bar) --[[ ROBLOX CHECK: check if 'bar' is an Array ]]
do
end
