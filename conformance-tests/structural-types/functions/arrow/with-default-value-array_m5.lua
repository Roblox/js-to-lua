-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/structural-types/functions/arrow/with-default-value-array_m5.ts
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
type Array<T> = LuauPolyfill.Array<T>
local function foo(bar_: Array<any>?)
	local bar: Array<any> = if bar_ ~= nil then bar_ else {}
end
