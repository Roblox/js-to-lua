-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/import/absolute/default-member-and-alias_m4x.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local fooModule = require(Packages.foo)
local foo = fooModule.default
local bar = fooModule.bar
local fizz = fooModule.baz
