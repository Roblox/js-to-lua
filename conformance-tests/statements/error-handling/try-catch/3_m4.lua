-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/error-handling/try-catch/3_m4.js
local a, b, c
local function d()
	do --[[ ROBLOX COMMENT: try-catch-finally block conversion ]]
		local ok, result, hasReturned = xpcall(function()
			return "foo", true
		end, function(error_)
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
