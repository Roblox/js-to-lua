local a, b, c, d = 1, "this is ", 2, 3
local foo = {
	bar = (function()
		c += d
		a += c
		return a
	end)(),
	baz = (function()
		b ..= "roblox"
		a ..= b
		return a
	end)(),
}
