-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/import/absolute/multiple-named-with-mixed-dot-and-dash-in-imported-path_m5.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local fooBarBazFizzJsModule = require(Packages["foo-bar"]["baz.fizz-js"])
local foo = fooBarBazFizzJsModule.foo
local bar = fooBarBazFizzJsModule.bar
local baz = fooBarBazFizzJsModule.baz
