type void = nil --[[ ROBLOX FIXME: adding `void` type alias to make it easier to use Luau `void` equivalent when supported ]]
local exports = {}
local function foo(fn: Function<void | Function>) end
exports.foo = foo
return exports
