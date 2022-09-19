-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/flow-types/union/union-type-annotation-multiple-number-literals-with-comments_m6.js
type ValueNotSoSimple = --[[ this is 1 number literal annotation leading comment ]]
	number --[[ ROBLOX NOTE: changed '1' to 'number' as Luau doesn't support numeric singleton types ]]
	--[[ this is 1 number literal annotation trailing comment and 2 number literal annotation leading comment ]]
	--[[ ROBLOX NOTE: changed '2' to 'number' as Luau doesn't support numeric singleton types ]]
	--[[ this is 2 number literal annotation trailing comment and string type annotation leading comment ]]
	| string
--[[ this is string type annotation trailing comment and number type annotation leading comment ]]
