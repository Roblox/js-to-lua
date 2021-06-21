local a
local function foo(bar) end
foo((function()
	a = "bar"
	return a
end)())
