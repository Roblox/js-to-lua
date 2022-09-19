-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/conditional/if-else/0_m4.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local a, b = 0, "foo"
if Boolean.toJSBoolean(a) then
elseif Boolean.toJSBoolean(b) then
elseif Boolean.toJSBoolean(tostring(b) .. "bar") then
else
end
