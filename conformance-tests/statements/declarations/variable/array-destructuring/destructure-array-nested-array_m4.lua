-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/variable/array-destructuring/destructure-array-nested-array_m4.js
local a = ({ 1, { 2, 3 } })[1]
local b, c = table.unpack(table.unpack({ 1, { 2, 3 } }, 2, 2), 1, 2)
