-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/precedence_m4.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local d = (a + b) * c
local e = a + b * c
local f = a + b * c
local g = a * b + c
local h = a * (b + c)
local i = a * b + c
local j = -a + b
local k = -(a + b)
local l = not Boolean.toJSBoolean(a) == b
local m = not (a == b)
