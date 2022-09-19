-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/unary/negation-null_m2.js
local v = not false --[[ ROBLOX DEVIATION: coerced from `null` to preserve JS behavior ]]
