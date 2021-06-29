local a, b, c, d
do --[[ ROBLOX comment: switch statement conversion ]]
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
			end
		end
	end
	if not break_ then
		d = 3
	end
end
