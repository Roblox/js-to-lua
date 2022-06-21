local function f()
	return Promise.resolve():andThen(function()
		local foo = Promise.resolve():expect()
	end)
end
