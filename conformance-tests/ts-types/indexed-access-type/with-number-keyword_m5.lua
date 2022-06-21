local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
type Array<T> = LuauPolyfill.Array<T>
type FooArray = Array<any>
type Test = typeof((({} :: any) :: FooArray)[1]) --[[ ROBLOX CHECK: Resulting type may differ ]] --[[ Upstream: FooArray[number] ]]
