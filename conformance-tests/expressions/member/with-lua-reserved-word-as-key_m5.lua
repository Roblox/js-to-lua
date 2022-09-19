-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/member/with-lua-reserved-word-as-key_m5.js
local foo = {}
local a = foo["repeat"]
local b = foo["until"]
local nested = foo["repeat"]["until"]
local mixed = foo["not"]["repeat"].string["until"]
