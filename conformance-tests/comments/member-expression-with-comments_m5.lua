-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/comments/member-expression-with-comments_m5.js
local foo = bar -- comment after bar
	.fizz
	--[[ block comment after fizz]]
	-- comment after fizz
	:buzz() -- comment after buzz
	.jazz
