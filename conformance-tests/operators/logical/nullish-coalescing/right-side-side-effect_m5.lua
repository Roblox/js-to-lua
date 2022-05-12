local foo
local bar = if foo ~= nil
	then foo
	else (function()
		foo = 0
		return foo
	end)()
