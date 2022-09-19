-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/for-loops/complex/with-inner-function-using-let-scoped-variable-multiple-identifiers_m5.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local console = LuauPolyfill.console
local function printFn(num)
	console.log(num)
end
local items = {}
do
	local function _loop(i, j)
		table.insert(items, {
			printMethod = function(self)
				printFn(i)
			end,
		}) --[[ ROBLOX CHECK: check if 'items' is an Array ]]
	end
	local i, j = 0, 0
	while
		i
		< 5 --[[ ROBLOX CHECK: operator '<' works only if either both arguments are strings or both are a number ]]
	do
		_loop(i, j)
		i += 1
		j += 2
	end
end
items[
	1 --[[ ROBLOX adaptation: added 1 to array index ]]
]:printMethod()
