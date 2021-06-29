local a, b, c
local function d()
	do --[[ ROBLOX COMMENT: try-catch-finally block conversion ]]
		local ok, result, hasReturned = xpcall(function()
			return "foo", true
		end, function(err)
			local error_ = err
			b = tostring(error_)
		end)
		do
			c = "baz"
		end
		if hasReturned then
			return result
		end
	end
end
