-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/flow-types/auto-imports/promise_m6.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
type Promise<T> = LuauPolyfill.Promise<T>
type Foo = Promise<any>
