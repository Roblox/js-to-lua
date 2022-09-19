-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/call/method-call_m5.js
local foo = { bar = function(self) end }
foo.bar(foo, 1, 2, 3)
