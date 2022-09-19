-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/unary/negation-undefined_m2.js
local v = not false --[[ ROBLOX DEVIATION: coerced from `undefined` to preserve JS behavior ]]
