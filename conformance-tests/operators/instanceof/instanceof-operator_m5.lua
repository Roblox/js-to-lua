-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/instanceof/instanceof-operator_m5.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local instanceof = LuauPolyfill.instanceof
local foo = instanceof(bar, baz)
