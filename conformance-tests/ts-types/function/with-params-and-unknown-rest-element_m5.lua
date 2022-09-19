-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/ts-types/function/with-params-and-unknown-rest-element_m5.ts
type Fn = (
	foo: string,
	...any --[[ ROBLOX CHECK: check correct type of elements. Upstream type: <RestType> ]]
) -> boolean
