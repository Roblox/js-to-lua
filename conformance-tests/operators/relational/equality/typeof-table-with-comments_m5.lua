-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/relational/equality/typeof-table-with-comments_m5.js
local test1 = --[[ comment 1 ]]
	typeof(foo) == "table"
--[[ comment 2 ]]
local test2 = --[[ comment 3 ]]
	"table" == typeof(foo)
--[[ comment 4 ]]
