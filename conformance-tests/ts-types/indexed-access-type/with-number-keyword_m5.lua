-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/ts-types/indexed-access-type/with-number-keyword_m5.ts
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
type Array<T> = LuauPolyfill.Array<T>
type FooArray = Array<any>
type Test = typeof((({} :: any) :: FooArray)[1]) --[[ ROBLOX CHECK: Resulting type may differ ]] --[[ Upstream: FooArray[number] ]]
