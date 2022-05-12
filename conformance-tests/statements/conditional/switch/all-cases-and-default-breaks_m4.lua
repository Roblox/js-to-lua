local a, b = 0
repeat --[[ ROBLOX comment: switch statement conversion ]]
	local entered_, break_ = false, false
	local condition_ = (function()
		local ref = a
		a += 1
		return ref
	end)()
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
	if not break_ then
		b = 3
		break
	end
until true
