local a, b = 0, 1
local function foo(arg) end
foo((function()
	a += 1
	b -= 1
	return b
end)())
