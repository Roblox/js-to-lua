-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/flow-types/typeof/typeof-type-annotation-object-property_m6.js
local bar = "string"
local foo: { bar: typeof(bar) } = { bar = "baz" }
