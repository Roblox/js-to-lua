-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/member/with-lua-globals-as-key_m5.js
local foo = {}
local err = foo.error
local tbl = foo.table
local nested = foo.error.table
