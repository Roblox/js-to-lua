-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/error-handling/try-catch/2_m4.js
local function foo()
	local a
	do --[[ ROBLOX COMMENT: try-finally block conversion ]]
		local ok, result, hasReturned = pcall(function()
			a = "foo"
		end)
		do
			return "bar"
		end
		if hasReturned then
			return result
		end
		if not ok then
			error(result)
		end
	end
end
