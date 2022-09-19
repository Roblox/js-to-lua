-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/for-loops/complex/with-directly-using-let-scoped-variable_m5.js
local function printFn(num)
	return num
end
local items = {}
do
	local index = 0
	while
		index
		< 5 --[[ ROBLOX CHECK: operator '<' works only if either both arguments are strings or both are a number ]]
	do
		table.insert(items, { printResult = printFn(index) }) --[[ ROBLOX CHECK: check if 'items' is an Array ]]
		index += 1
	end
end
