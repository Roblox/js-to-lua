local ref = (function()
	local ref = if typeof(foo) == "table" then foo.bar else nil
	return if ref ~= nil then ref() else nil
end)()
local v = if ref ~= nil then ref() else nil
