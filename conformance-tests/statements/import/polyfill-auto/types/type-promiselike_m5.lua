local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
type PromiseLike<T> = LuauPolyfill.PromiseLike<T>
local foo: PromiseLike<string>
