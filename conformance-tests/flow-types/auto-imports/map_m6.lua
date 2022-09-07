local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
type Map<T, U> = LuauPolyfill.Map<T, U>
type Bar = Map<any, any>
