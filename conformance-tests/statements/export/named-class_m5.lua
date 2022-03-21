local exports = {}
export type Foo = { prop: any } --[[ ROBLOX TODO: replace 'any' type/ add missing ]]
local Foo = {}
Foo.__index = Foo
function Foo.new()
	local self = setmetatable({}, Foo)
	return self
end
exports.Foo = Foo
return exports
