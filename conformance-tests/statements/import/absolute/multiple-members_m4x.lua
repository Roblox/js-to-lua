-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/import/absolute/multiple-members_m4x.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local fooModule = require(Packages.foo)
local foo = fooModule.foo
local bar = fooModule.bar
local baz = fooModule.baz
