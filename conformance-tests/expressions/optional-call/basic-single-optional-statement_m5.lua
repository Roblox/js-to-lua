local ref = if typeof(foo) == "table" then foo.bar else nil
if ref ~= nil then
	ref()
end
