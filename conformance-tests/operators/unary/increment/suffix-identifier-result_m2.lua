local result = 0
local v = (function()
	local result_ = result
	result += 1
	return result_
end)()
