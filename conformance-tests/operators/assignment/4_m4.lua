local a, b, c
local function foo(bar) end
foo((function()
	c = "bar"
	b = c
	a = b
	return a
end)())
