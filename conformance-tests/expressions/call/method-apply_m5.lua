-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/call/method-apply_m5.js
local foo = { bar = function(self) end }
local args = { 1, 2, 3 }
foo.bar(foo, table.unpack(args))
