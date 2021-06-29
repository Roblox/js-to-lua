local function foo(a)
	local result = 0
	do --[[ ROBLOX comment: switch statement conversion ]]
		local entered_, break_ = false, false
		local condition_ = a
		for _, v in ipairs({ 0, 1, 2, 3 }) do
			if condition_ == v then
				if v == 0 then
					entered_ = true
					return 1
				end
				if v == 1 or entered_ then
					entered_ = true
					return result
				end
				if v == 2 or entered_ then
					entered_ = true
					result += a
				end
				if v == 3 or entered_ then
					entered_ = true
					return result
				end
			end
		end
		if not break_ then
			return 3
		end
	end
end
