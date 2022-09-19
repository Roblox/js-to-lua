-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/flow-types/function/with-params-with-generic-params-and-variance-sigils_m6.js
type Fn = <
	T, --[[ ROBLOX CHECK: upstream type uses variance sigil which is not supported by Luau ]] --[[ +T ]]
	U --[[ ROBLOX CHECK: upstream type uses variance sigil which is not supported by Luau ]] --[[ -U ]]
>(foo: T) -> U
