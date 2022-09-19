-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/arithmetic/add-multiple-template-literals_m5.js
local exp = "some expression"
local foo = "foo" .. [[bar
baz]] .. ("%s"):format(tostring(exp))
local bar = [[bar
baz]] .. ("%s"):format(tostring(exp)) .. "foo"
local baz = ("%s"):format(tostring(exp)) .. "foo" .. [[bar
baz]]
