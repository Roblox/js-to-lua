type Fn = <T, U>(
	foo: T,
	...any --[[ ROBLOX CHECK: check correct type of elements. Upstream type: <RestType> ]]
) -> U
