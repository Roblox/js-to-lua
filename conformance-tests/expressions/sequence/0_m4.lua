local a, b = 0, 1
local function foo(arg)
end
foo((function()
	(function()
		local result = a
		a += 1
		return result
	end)()
	return (function()
		b -= 1
		return b
	end)()
end)())
