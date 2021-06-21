local a, b, c = 1, "this is ", 2

local function foo(bar) end
foo((function()
	c ..= "bar"
	b ..= c
	a ..= b
	return a
end)())
