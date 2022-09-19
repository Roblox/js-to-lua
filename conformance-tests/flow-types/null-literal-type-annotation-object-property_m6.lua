-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/flow-types/null-literal-type-annotation-object-property_m6.js
local foo: {
	bar: string | nil, --[[ ROBLOX CHECK: verify if `null` wasn't used differently than `undefined` ]]
} | nil --[[ ROBLOX CHECK: verify if `null` wasn't used differently than `undefined` ]] =
	{ bar = "baz" }
