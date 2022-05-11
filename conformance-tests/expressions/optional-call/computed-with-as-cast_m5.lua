local v = (function()
	local ref = if typeof(foo :: any) == "table" then (foo :: any)["bar"] else nil
	return if ref ~= nil then ref() else nil
end)()
