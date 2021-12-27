local exp = "some expression"
local foo = "foo" .. [[bar
baz]] .. ("%s"):format(exp)
local bar = [[bar
baz]] .. ("%s"):format(exp) .. "foo"
local baz = ("%s"):format(exp) .. "foo" .. [[bar
baz]]
