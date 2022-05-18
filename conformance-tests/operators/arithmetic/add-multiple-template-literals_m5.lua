local exp = "some expression"
local foo = "foo" .. [[bar
baz]] .. ("%s"):format(tostring(exp))
local bar = [[bar
baz]] .. ("%s"):format(tostring(exp)) .. "foo"
local baz = ("%s"):format(tostring(exp)) .. "foo" .. [[bar
baz]]
