-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/call/spread-params/spread-middle-of-multiple-params_m5.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Array = LuauPolyfill.Array
foo(table.unpack(Array.concat({}, { bar }, Array.spread(baz), { fizz })))
