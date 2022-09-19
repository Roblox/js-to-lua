-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/export/reexport-absolute/named-list-with-aliases_m4.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local exports = {}
local fooModule = require(Packages.foo)
exports.a = fooModule.a
exports.b = fooModule.b
exports.c = fooModule.foo
exports.d = fooModule.bar
return exports
