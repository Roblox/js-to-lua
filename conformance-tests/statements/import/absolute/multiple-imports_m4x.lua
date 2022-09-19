-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/import/absolute/multiple-imports_m4x.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local foo = require(Packages.foo).foo
local bar = require(Packages.bar).default
local baz = require(Packages.baz)
local fizzModule = require(Packages.fizz)
local fizz = fizzModule.default
local fuzz = fizzModule.fuzz
