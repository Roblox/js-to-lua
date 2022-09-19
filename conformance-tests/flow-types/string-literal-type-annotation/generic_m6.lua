-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/flow-types/string-literal-type-annotation/generic_m6.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
type Map<T, U> = LuauPolyfill.Map<T, U>
type Baz = Map<"foo" | "bar", "fizz" | "fuzz">
