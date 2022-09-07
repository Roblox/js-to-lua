local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
type Promise<T> = LuauPolyfill.Promise<T>
type Foo = Promise<any>
