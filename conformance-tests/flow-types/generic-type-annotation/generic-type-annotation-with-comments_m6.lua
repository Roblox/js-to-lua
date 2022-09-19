-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/flow-types/generic-type-annotation/generic-type-annotation-with-comments_m6.js
-- This is a comment before
type Foo = --[[ Comment before Bar ]]
	Bar<--[[ Before X ]]
		X, --[[ After X ]]
		--[[ Before Y ]]
		Y, --[[ After Y ]]
		--[[ Before Z ]]
		Z
		--[[ After Z ]]
	> -- This is a comment after
