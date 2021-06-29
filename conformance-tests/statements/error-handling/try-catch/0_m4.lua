local a, b
do --[[ ROBLOX COMMENT: try-catch block conversion ]]
	local ok, result, hasReturned = xpcall(function()
		a = "foo"
	end, function(err)
		local error_ = err
		b = tostring(error_)
	end)
	if hasReturned then
		return result
	end
end
