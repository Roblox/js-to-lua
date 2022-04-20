local exports = {}
--[[ Comment 1 ]]
local function thisIsTest(): () end
exports.thisIsTest = thisIsTest
--[[ Comment 2 ]]
local foo = "foo"
exports.foo = foo
--[[ Comment 3 ]]
export type Foo = {} --[[ ROBLOX TODO: replace 'any' type/ add missing ]]
local Foo = {}
Foo.__index = Foo
function Foo.new(): Foo
	local self = setmetatable({}, Foo)
	return (self :: any) :: Foo
end
exports.Foo = Foo
--[[ Comment 4 ]]
return exports
