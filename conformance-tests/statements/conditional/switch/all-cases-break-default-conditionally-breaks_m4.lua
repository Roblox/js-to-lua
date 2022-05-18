local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local a, b, breakFast = 0
repeat --[[ ROBLOX comment: switch statement conversion ]]
	local condition_ = a
	a += 1
	if condition_ == 0 then
		b = 1
		break
	elseif condition_ == 1 then
		b = 2
		break
	else
		if Boolean.toJSBoolean(breakFast) then
			break
		end
		b = 3
	end
until true
