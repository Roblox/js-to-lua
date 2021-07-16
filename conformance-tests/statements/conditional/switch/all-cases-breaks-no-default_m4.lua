local a, b
repeat --[[ ROBLOX comment: switch statement conversion ]]
	local entered_, break_ = false, false
	local condition_ = a
	for _, v in ipairs({ 0, 1 }) do
		if condition_ == v then
			if v == 0 then
				entered_ = true
				b = 1
				break_ = true
				break
			end
			if v == 1 or entered_ then
				entered_ = true
				b = 2
				break_ = true
				break
			end
		end
	end
until true
