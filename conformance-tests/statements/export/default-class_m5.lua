local exports = {}
export type Foo = { prop: any } --[[ ROBLOX TODO: replace 'any' type/ add missing ]]
local Foo = {}
Foo.__index = Foo
function Foo.new(): Foo
	local self = setmetatable({}, Foo)
	return (self :: any) :: Foo
end
exports.default = Foo
return exports
