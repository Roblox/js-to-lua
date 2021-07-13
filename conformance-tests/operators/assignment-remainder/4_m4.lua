local a = 1
local function foo(bar) end
foo((function()
	a %= 1
	return a
end)())
