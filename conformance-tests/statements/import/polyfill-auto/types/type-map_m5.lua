local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
type Map<T, U> = LuauPolyfill.Map<T, U>
local foo: Map<string, boolean>
