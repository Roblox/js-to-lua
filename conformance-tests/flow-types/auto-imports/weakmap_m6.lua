-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/flow-types/auto-imports/weakmap_m6.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
type WeakMap<T, U> = LuauPolyfill.WeakMap<T, U>
type Bar = WeakMap<any, any>
