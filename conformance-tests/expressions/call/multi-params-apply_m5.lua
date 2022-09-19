-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/call/multi-params-apply_m5.js
local foo = { apply = function(self) end }
foo:apply(1, 2, 3)
