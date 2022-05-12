local ref = if typeof(if typeof(foo) == "table" then foo.bar else nil) == "table"
	then (if typeof(foo) == "table" then foo.bar else nil).fizz
	else nil
if ref ~= nil then
	ref()
end
