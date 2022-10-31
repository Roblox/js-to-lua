-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/structural-types/functions/expressions/with-multiple-destructured-obj-param-and-default-values_m4.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
type Array<T> = LuauPolyfill.Array<T>
type Object = LuauPolyfill.Object
local fizz, fuzz
local function reduce(ref0_: Object?, ref1_: Array<any>?)
	local ref0: Object = if ref0_ ~= nil then ref0_ else fizz
	local foo = ref0.foo
	local ref1: Array<any> = if ref1_ ~= nil then ref1_ else fuzz
	local bar = ref1[1]
	return { foo, bar }
end
