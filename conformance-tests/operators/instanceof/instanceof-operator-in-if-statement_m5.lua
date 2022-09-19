-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/instanceof/instanceof-operator-in-if-statement_m5.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local console = LuauPolyfill.console
local instanceof = LuauPolyfill.instanceof
if instanceof(foo, bar) then
	console.log("boo")
end
