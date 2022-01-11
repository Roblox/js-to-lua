local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Array = LuauPolyfill.Array
local arr = Array.concat({}, Array.concat({}, { 1, 2 }, Array.spread("fizz")), Array.spread("baz"))
