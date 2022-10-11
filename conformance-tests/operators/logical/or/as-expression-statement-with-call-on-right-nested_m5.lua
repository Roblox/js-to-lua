-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/logical/or/as-expression-statement-with-call-on-right-nested_m5.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local ref = Boolean.toJSBoolean(foo) and foo or bar
if not Boolean.toJSBoolean(ref) then
	baz()
end
