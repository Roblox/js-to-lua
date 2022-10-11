-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/logical/and/as-expression-statement-with-call-on-right-nested_m5.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local ref = if Boolean.toJSBoolean(foo) then bar else foo
if Boolean.toJSBoolean(ref) then
	baz()
end
