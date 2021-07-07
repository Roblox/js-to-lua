local Packages --[[ ROBLOX comment: must define Packages module ]]
local exports = {}
local fooModule = require(Packages.foo)
exports.a = fooModule.a
exports.b = fooModule.b
exports.foo = fooModule.foo
exports.bar = fooModule.bar
return exports
