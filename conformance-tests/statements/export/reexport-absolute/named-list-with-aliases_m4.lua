local Packages --[[ ROBLOX comment: must define Packages module ]]
local exports = {}
local fooModule = require(Packages.foo)
exports.a = fooModule.a
exports.b = fooModule.b
exports.c = fooModule.foo
exports.d = fooModule.bar
return exports
