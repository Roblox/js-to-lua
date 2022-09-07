local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
type Set<T> = LuauPolyfill.Set<T>
type Foo = Set<any>
