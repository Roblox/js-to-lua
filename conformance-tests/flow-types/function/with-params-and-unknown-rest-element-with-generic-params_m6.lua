-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/flow-types/function/with-params-and-unknown-rest-element-with-generic-params_m6.js
type Fn = <T, U>(
	foo: T,
	...any --[[ ROBLOX CHECK: check correct type of elements. Upstream type: <RestType> ]]
) -> U
