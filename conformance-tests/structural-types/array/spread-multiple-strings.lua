-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/structural-types/array/spread-multiple-strings.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Array = LuauPolyfill.Array
local arr = Array.concat({}, Array.concat({}, { 1, 2 }, Array.spread("fizz")), Array.spread("baz"))
