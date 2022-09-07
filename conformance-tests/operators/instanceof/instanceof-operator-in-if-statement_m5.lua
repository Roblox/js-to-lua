local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local console = LuauPolyfill.console
local instanceof = LuauPolyfill.instanceof
if instanceof(foo, bar) then
	console.log("boo")
end
