-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/import/polyfill-auto/call-expression/clearTimeout_m5.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local clearTimeout = LuauPolyfill.clearTimeout
clearTimeout(timeout)
