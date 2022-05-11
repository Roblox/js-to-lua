local v = (function()
	local ref = (function()
		local ref = if typeof(foo) == "table" then foo.bar else nil
		return if ref ~= nil then ref() else nil
	end)()
	return if ref ~= nil then ref() else nil
end)()
