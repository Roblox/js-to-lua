-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/error-handling/try-catch/0_m4.js
local a, b
do --[[ ROBLOX COMMENT: try-catch block conversion ]]
	local ok, result, hasReturned = xpcall(function()
		a = "foo"
	end, function(error_)
		b = tostring(error_)
	end)
	if hasReturned then
		return result
	end
end
