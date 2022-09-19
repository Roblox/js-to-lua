-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/unary/negation-falsy-number-literal_m2.js
local v = not false --[[ ROBLOX DEVIATION: coerced from `0` to preserve JS behavior ]]
