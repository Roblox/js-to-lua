local v = (function()
	local ref = if typeof(foo) == "table" then foo["$$typeof"] else nil
	return if ref ~= nil then ref() else nil
end)()
