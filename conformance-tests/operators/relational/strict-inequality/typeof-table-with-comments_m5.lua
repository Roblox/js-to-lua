local test1 = --[[ comment 1 ]]
	typeof(foo) ~= "table"
--[[ comment 2 ]]
local test2 = --[[ comment 3 ]]
	"table" ~= typeof(foo)
--[[ comment 4 ]]
