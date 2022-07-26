type EntityStore = { makeCacheKey: (self: EntityStore, ...any) -> any }
local EntityStore = {}
EntityStore.__index = EntityStore
function EntityStore.new(): EntityStore
	local self = setmetatable({}, EntityStore)
	return (self :: any) :: EntityStore
end
function EntityStore:makeCacheKey(...: any): any
	local args = { ... }
	return self.group.keyMaker:lookupArray(args)
end
