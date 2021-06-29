local a, b
do --[[ ROBLOX comment: switch statement conversion ]]
	local entered_, break_ = false, false
	local condition_ = a
	for _, v in ipairs({ 0, 1, 2 }) do
		if condition_ == v then
			if v == 0 then
				entered_ = true
			end
			if v == 1 or entered_ then
				entered_ = true
				b = 1
				break_ = true
				break
			end
			if v == 2 or entered_ then
				entered_ = true
			end
		end
	end
	if not break_ then
		b = 3
	end
end
