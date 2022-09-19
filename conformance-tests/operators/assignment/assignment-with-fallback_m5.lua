-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/assignment/assignment-with-fallback_m5.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local retryTimes
local ref = tonumber(foo, 10)
retryTimes = Boolean.toJSBoolean(ref) and ref or 0
