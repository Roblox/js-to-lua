-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/import/polyfill-auto/types/type-set_m5.ts
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
type Set<T> = LuauPolyfill.Set<T>
local foo: Set<string>
