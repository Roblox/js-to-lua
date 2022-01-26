local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Array = LuauPolyfill.Array
Array.unshift(foo, table.unpack(bar)) --[[ ROBLOX CHECK: check if 'arr' is an Array ]]
