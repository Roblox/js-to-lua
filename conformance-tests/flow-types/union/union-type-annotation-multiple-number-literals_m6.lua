-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/flow-types/union/union-type-annotation-multiple-number-literals_m6.js
type ValueSimple =
	number --[[ ROBLOX NOTE: changed '1' to 'number' as Luau doesn't support numeric singleton types ]] --[[ ROBLOX NOTE: changed '2' to 'number' as Luau doesn't support numeric singleton types ]]
	| string
