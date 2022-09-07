local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
type WeakMap<T, U> = LuauPolyfill.WeakMap<T, U>
type Bar = WeakMap<any, any>
