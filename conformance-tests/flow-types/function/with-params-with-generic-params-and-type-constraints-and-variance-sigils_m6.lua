-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/flow-types/function/with-params-with-generic-params-and-type-constraints-and-variance-sigils_m6.js
type Fn = <
	T, --[[ ROBLOX CHECK: upstream type uses variance sigil which is not supported by Luau ]] --[[ ROBLOX CHECK: upstream type uses type constraint which is not supported by Luau ]] --[[ +T: string ]]
	U --[[ ROBLOX CHECK: upstream type uses variance sigil which is not supported by Luau ]] --[[ ROBLOX CHECK: upstream type uses type constraint which is not supported by Luau ]] --[[ -U: number ]]
>(foo: T) -> U
