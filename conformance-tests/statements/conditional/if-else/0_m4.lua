local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local a, b = 0, "foo"
if Boolean.toJSBoolean(a) then
elseif Boolean.toJSBoolean(b) then
elseif Boolean.toJSBoolean(tostring(b) .. "bar") then
else
end
