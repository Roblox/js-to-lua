local a, b, c = 1, 2, 3
local foo = {
	bar = (function()
		b -= c
		a -= b
		return a
	end)(),
	baz = (function()
		b -= 1
		a -= b
		return a
	end)(),
}
