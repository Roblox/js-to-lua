-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/import/relative/multiple-named-with-mixed-dot-and-dash-in-imported-path_m5.js
local bazFizzJsModule = require(script.Parent["foo-bar"]["baz.fizz-js"])
local foo = bazFizzJsModule.foo
local bar = bazFizzJsModule.bar
local baz = bazFizzJsModule.baz
