-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/call/method-multi-params-apply_m5.js
local foo = { bar = { apply = function(self) end } }
foo.bar:apply(1, 2, 3)
