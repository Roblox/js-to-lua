local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
type Array<T> = LuauPolyfill.Array<T>
local foo: Array<Array<{ foo: string, bar: Array<Array<string>> }>> = {}
