-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/call/spread-params/spread-multiple-params_m5.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Array = LuauPolyfill.Array
foo(table.unpack(Array.concat({}, Array.spread(bar), Array.spread(baz), Array.spread(fizz))))
