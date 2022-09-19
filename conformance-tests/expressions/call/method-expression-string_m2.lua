-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/call/method-expression-string_m2.js
local foo = { ["some-method"] = function(self) end }
foo["some-method"](foo)
