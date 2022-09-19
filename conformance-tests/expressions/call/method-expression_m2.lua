-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/call/method-expression_m2.js
local foo = { ["some-method"] = function(self) end }
local method = "method"
foo["some-" .. tostring(method)](foo)
