local a, b, c = 1, 2, 3
local function foo(bar) end
c %= 1
b %= c
a %= b
foo(a)
