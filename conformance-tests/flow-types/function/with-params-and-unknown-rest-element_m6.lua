type Fn = (
	foo: string,
	...any --[[ ROBLOX CHECK: check correct type of elements. Upstream type: <RestType> ]]
) -> boolean
