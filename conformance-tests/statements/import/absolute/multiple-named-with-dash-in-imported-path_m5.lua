-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/import/absolute/multiple-named-with-dash-in-imported-path_m5.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local fooBarJsModule = require(Packages.foo["bar-js"])
local foo = fooBarJsModule.foo
local bar = fooBarJsModule.bar
local baz = fooBarJsModule.baz
