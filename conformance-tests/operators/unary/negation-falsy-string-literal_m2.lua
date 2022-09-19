-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/unary/negation-falsy-string-literal_m2.js
local v = not false --[[ ROBLOX DEVIATION: coerced from `''` to preserve JS behavior ]]
