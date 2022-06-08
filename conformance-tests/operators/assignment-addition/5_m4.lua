local a, b, c = 1, "this is ", 2
local function foo(bar) end
c ..= "bar"
b ..= c
a ..= b
foo(a)
