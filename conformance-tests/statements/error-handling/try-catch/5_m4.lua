local b, c
local function d()
	do --[[ ROBLOX COMMENT: try-catch-finally block conversion ]]
		local ok, result, hasReturned = xpcall(function()
			local ref = b
			b += 1
			return ref, true
		end, function(error_)
			local ref = c
			c += 1
			return ref, true
		end)
		do
			return b + c
		end
		if hasReturned then
			return result
		end
	end
end
