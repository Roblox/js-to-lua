-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/call/date/date-now-with-comments_m5.js
local t = --[[ comment 1 ]]
	DateTime
		.now()
		--[[ comment 2 ]]
		.UnixTimestampMillis --[[ comment 3 ]]
--[[ comment 4 ]]
