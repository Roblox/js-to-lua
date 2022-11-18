-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/import/relative/multiple-named-with-dot-in-imported-path_m5.js
local barJsModule = require(script.Parent.foo["bar.js"])
local foo = barJsModule.foo
local bar = barJsModule.bar
local baz = barJsModule.baz
