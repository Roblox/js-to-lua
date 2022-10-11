-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/logical/or/as-expression-statement-with-identifier-on-right-nested_m5.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local ref = Boolean.toJSBoolean(foo) and foo or bar
if not Boolean.toJSBoolean(ref) then
	error("not implemented") --[[ ROBLOX TODO: Lua doesn't support 'Identifier' as a standalone type ]] --[[ baz ]]
end
