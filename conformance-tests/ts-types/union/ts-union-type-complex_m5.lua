-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/ts-types/union/ts-union-type-complex_m5.ts
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
type Object = LuauPolyfill.Object
type ValueComplex =
	number
	| string
	| Reference
	| Object
	| { foo: number | Object, bar: number | string | Reference | Object }
