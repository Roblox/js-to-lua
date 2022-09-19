-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/call/method-nested_m2.js
local foo = { bar = { baz = function(self) end } }
foo.bar:baz()
