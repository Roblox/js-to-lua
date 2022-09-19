-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/complex/jest-config-resolve-config-path-test_m5.ts
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Array = LuauPolyfill.Array
local function pickPairsWithSameOrder<T>(array: ReadonlyArray<T>)
	return Array.reduce(
		Array.map(array, function(value1, idx, arr)
			return Array.map(
				Array.slice(arr, idx + 1), --[[ ROBLOX CHECK: check if 'arr' is an Array ]]
				function(value2)
					return { value1, value2 }
				end
			)
		end), --[[ ROBLOX CHECK: check if 'array' is an Array ]] -- use .flat() when we drop Node 10
		function(acc, val)
			return Array.concat(acc, val) --[[ ROBLOX CHECK: check if 'acc' is an Array ]]
		end,
		{}
	)
end
