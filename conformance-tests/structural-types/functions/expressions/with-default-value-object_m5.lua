-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/structural-types/functions/expressions/with-default-value-object_m5.ts
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
type Object = LuauPolyfill.Object
local function foo(bar_: Object?)
	local bar: Object = if bar_ ~= nil then bar_ else {}
end
