local a, b = 0, 1
local function baz()
end
local foo = {
	bar = (function()
		(function()
			local result = a
			a += 1
			return result
		end)();
		(function()
			b -= 1
			return b
		end)()
		return baz()
	end)(),
}
