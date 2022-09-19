-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/optional-member/with-lua-globals-as-key_m5.js
local foo = {}
local err = if typeof(foo) == "table" then foo.error else nil
local tbl = if typeof(foo) == "table" then foo.table else nil
local nested = if typeof(if typeof(foo) == "table" then foo.error else nil) == "table"
	then (if typeof(foo) == "table" then foo.error else nil).table
	else nil
