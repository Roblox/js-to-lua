local exports = {}
local barModule = require(script.Parent.foo.bar)
exports.a = barModule.a
exports.b = barModule.b
exports.foo = barModule.foo
exports.bar = barModule.bar
return exports
