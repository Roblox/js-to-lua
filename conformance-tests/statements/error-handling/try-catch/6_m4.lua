-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/error-handling/try-catch/6_m4.js
local b, c
local function d()
	do --[[ ROBLOX COMMENT: try-catch-finally block conversion ]]
		local ok, result, hasReturned = xpcall(function()
			b = "foo"
		end, function(e)
			b = tostring(e)
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
