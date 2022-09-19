-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/conditional/switch/all-cases-one-break-with-default_m4.js
local a, b, c
repeat --[[ ROBLOX comment: switch statement conversion ]]
	local entered_, break_ = false, false
	local condition_ = a
	for _, v in ipairs({ 0, 1 }) do
		if condition_ == v then
			if v == 0 then
				entered_ = true
				b = 1
			end
			if v == 1 or entered_ then
				entered_ = true
				c = 2
				break_ = true
				break
			end
		end
	end
	if not break_ then
		b = 3
	end
until true
