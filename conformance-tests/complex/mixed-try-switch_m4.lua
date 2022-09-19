-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/complex/mixed-try-switch_m4.js
local c
local a = f()
local function h()
	repeat --[[ ROBLOX comment: switch statement conversion ]]
		local entered_, break_ = false, false
		local condition_ = a
		for _, v in ipairs({ 1, 2 }) do
			if condition_ == v then
				if v == 1 then
					entered_ = true
					do --[[ ROBLOX COMMENT: try-catch block conversion ]]
						local ok, result, hasReturned = xpcall(function()
							g()
						end, function(e)
							return e, true
						end)
						if hasReturned then
							return result
						end
					end
				end
				if v == 2 or entered_ then
					entered_ = true
					c = 2
					break_ = true
					break
				end
			end
		end
	until true
	return "ok"
end
