local a, b
do --[[ ROBLOX COMMENT: try-finally block conversion ]]
	local ok, result, hasReturned = pcall(function()
		a = "foo"
	end)
	do
		b = "bar"
	end
	if hasReturned then
		return result
	end
	if not ok then
		error(result)
	end
end
