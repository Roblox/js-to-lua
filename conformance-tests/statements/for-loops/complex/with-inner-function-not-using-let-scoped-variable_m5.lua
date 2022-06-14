local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local console = LuauPolyfill.console
local function printFn(num)
	console.log(num)
end
local items = {}
do
	local index = 0
	while
		index
		< 5 --[[ ROBLOX CHECK: operator '<' works only if either both arguments are strings or both are a number ]]
	do
		table.insert(items, {
			printMethod = function(self)
				printFn("index")
			end,
		}) --[[ ROBLOX CHECK: check if 'items' is an Array ]]
		index += 1
	end
end
items[
	1 --[[ ROBLOX adaptation: added 1 to array index ]]
]:printMethod()
