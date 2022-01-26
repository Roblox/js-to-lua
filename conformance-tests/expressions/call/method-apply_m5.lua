local foo = { bar = function(self) end }
local args = { 1, 2, 3 }
foo.bar(foo, table.unpack(args))
