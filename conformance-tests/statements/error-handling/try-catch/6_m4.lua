local b, c
local function d()
	do --[[ ROBLOX COMMENT: try-catch-finally block conversion ]]
		local ok, result, hasReturned = xpcall(function()
			b = "foo"
		end, function(err)
			local error_ = err
			b = tostring(error_)
			return "baz", true
		end)
		do
			c = "bar"
		end
		if hasReturned then
			return result
		end
	end
end
