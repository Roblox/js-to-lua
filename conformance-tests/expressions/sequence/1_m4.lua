local a, b = 0, 1
local function baz() end
local foo = { bar = (function()
	a += 1
	b -= 1
	return baz()
end)() }
