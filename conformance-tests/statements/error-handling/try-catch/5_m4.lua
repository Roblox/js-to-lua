local b, c
local function d()
	do --[[ ROBLOX COMMENT: try-catch-finally block conversion ]]
		local ok, result, hasReturned = xpcall(function()
			return (function()
				local result = b
				b += 1
				return result
			end)(), true
		end, function(err)
			local error_ = err
			return (function()
				local result = c
				c += 1
				return result
			end)(), true
		end)
		do
			return b + c
		end
		if hasReturned then
			return result
		end
	end
end
