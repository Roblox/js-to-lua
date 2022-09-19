-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/unary/negation-truthy-string-literal_m2.js
local v = not true --[[ ROBLOX DEVIATION: coerced from `'foo'` to preserve JS behavior ]]
