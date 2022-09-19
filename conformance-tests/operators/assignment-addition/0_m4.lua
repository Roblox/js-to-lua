-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/assignment-addition/0_m4.js
local a, b, c, d = 1, "this is ", 2, 3
a += 1
b ..= "roblox"
c += 1 --[[ ROBLOX DEVIATION: coerced from `true` to preserve JS behavior ]]
d += a
