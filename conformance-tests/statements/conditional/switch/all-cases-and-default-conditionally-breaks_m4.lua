-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/conditional/switch/all-cases-and-default-conditionally-breaks_m4.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local a, b, breakFast = 0
repeat --[[ ROBLOX comment: switch statement conversion ]]
	local entered_, break_ = false, false
	local condition_ = a
	a += 1
	for _, v in ipairs({ 0, 1 }) do
		if condition_ == v then
			if v == 0 then
				entered_ = true
				if Boolean.toJSBoolean(breakFast) then
					break_ = true
					break
				end
				b = 1
			end
			if v == 1 or entered_ then
				entered_ = true
				if Boolean.toJSBoolean(breakFast) then
					break_ = true
					break
				end
				b = 2
			end
		end
	end
	if not break_ then
		if Boolean.toJSBoolean(breakFast) then
			break
		end
		b = 3
	end
until true
