-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/flow-types/union/union-type-annotation-complex_m6.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
type Object = LuauPolyfill.Object
type ValueComplex =
	number
	| string
	| Reference
	| Object
	| { foo: number | Object, bar: number | string | Reference | Object }
