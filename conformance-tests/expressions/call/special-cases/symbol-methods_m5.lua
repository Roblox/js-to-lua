-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/call/special-cases/symbol-methods_m5.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Symbol = LuauPolyfill.Symbol
local s0 = Symbol.for_("foo")
local s1 = Symbol.for_("foo")
local s2 = Symbol.aMethod("foo")
local s3 = Symbol["aMethod"]("foo")
