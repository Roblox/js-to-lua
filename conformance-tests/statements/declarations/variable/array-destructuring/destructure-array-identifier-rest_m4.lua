-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/variable/array-destructuring/destructure-array-identifier-rest_m4.js
local arr = { 1, 2, 3 }
local a = arr[1]
local b = table.pack(table.unpack(arr, 2))
