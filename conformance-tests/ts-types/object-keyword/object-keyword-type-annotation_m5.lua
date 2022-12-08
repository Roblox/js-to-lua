-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/ts-types/object-keyword/object-keyword-type-annotation_m5.ts
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
type Array<T> = LuauPolyfill.Array<T>
type Object = LuauPolyfill.Object
local obj: Object | Array<unknown> = { foo = 1 }
local arr: Object | Array<unknown> = { 1 }
