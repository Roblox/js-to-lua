local function printValue(value) end
local a = 0
printValue((function()
	local ref = a
	a += 1
	return ref
end)())
printValue((function()
	a += 1
	return a
end)())
printValue((function()
	local ref = a
	a -= 1
	return ref
end)())
printValue((function()
	a -= 1
	return a
end)())
