-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/unary/delete/computed-expression_m2.js
local foo = {}
foo[tostring(1 + 2 + 3 - 4)] = nil
