-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/comments/if-statement-with-condition-comment_m5.js
if
	foo
	> 2 --[[ ROBLOX CHECK: operator '>' works only if either both arguments are strings or both are a number ]]
	--[[ comment ]]
then
	bar()
end
