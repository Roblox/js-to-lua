local function printValue(value) end
local a = 0
printValue((function()
	local result = a
	a += 1
	return result
end)())
printValue((function()
	a += 1
	return a
end)())
printValue((function()
	local result = a
	a -= 1
	return result
end)())
printValue((function()
	a -= 1
	return a
end)())
