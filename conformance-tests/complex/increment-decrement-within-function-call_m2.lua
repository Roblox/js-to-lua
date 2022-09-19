-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/complex/increment-decrement-within-function-call_m2.js
local function printValue(value) end
local a = 0
printValue(a)
a += 1
a += 1
printValue(a)
printValue(a)
a -= 1
a -= 1
printValue(a)
