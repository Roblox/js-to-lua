-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/flow-types/auto-imports/mixed-types_m6.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
type Array<T> = LuauPolyfill.Array<T>
type Error = LuauPolyfill.Error
type Map<T, U> = LuauPolyfill.Map<T, U>
type Object = LuauPolyfill.Object
type Promise<T> = LuauPolyfill.Promise<T>
type Set<T> = LuauPolyfill.Set<T>
type Boo = Array<Promise<Map<Set<Object>, Error>>>
