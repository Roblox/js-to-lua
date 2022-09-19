-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/import/polyfill-auto/types/type-weakmap_m5.ts
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
type WeakMap<T, U> = LuauPolyfill.WeakMap<T, U>
local foo: WeakMap<any, boolean>
