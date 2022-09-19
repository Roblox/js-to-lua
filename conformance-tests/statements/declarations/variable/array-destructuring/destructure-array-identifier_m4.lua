-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/variable/array-destructuring/destructure-array-identifier_m4.js
local arr = { 1, 2, 3 }
local a, b, c = table.unpack(arr, 1, 3)
