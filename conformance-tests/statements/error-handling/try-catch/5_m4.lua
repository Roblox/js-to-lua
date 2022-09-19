-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/error-handling/try-catch/5_m4.js
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
