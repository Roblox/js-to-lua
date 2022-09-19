-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/import/absolute/default-type_m5.ts
local Packages --[[ ROBLOX comment: must define Packages module ]]
local fooModule = require(Packages.foo)
type foo = fooModule.default
