-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/import/polyfill-auto/types/type-map_m5.ts
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
type Map<T, U> = LuauPolyfill.Map<T, U>
local foo: Map<string, boolean>
