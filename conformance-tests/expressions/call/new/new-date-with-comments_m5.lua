-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/call/new/new-date-with-comments_m5.js
local d = --[[ comment 1 ]]
	--[[ comment 2 ]]
	DateTime
		.now --[[ comment 3 ]]()
--[[ comment 4 ]]
