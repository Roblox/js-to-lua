type Fn = <
	T, --[[ ROBLOX CHECK: upstream type uses variance sigil which is not supported by Luau ]] --[[ +T ]]
	U --[[ ROBLOX CHECK: upstream type uses variance sigil which is not supported by Luau ]] --[[ -U ]]
>(foo: T) -> U
