-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/logical/and/right-side-unknown-11_m3.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local falsy5 = 0 / 0
local falsy = nil
local foo = if Boolean.toJSBoolean(falsy5) then falsy else falsy5
