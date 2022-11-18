-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/call/special-cases/string-repeat_m5.js
string.rep(foo, 10) --[[ ROBLOX CHECK: check if 'foo' is a string ]]
string.rep("foo", 10)
