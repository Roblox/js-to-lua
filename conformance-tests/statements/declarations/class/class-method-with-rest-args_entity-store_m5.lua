type EntityStore = {
	makeCacheKey: (self: EntityStore, ...any) -> any,
	makeCacheKey: (self: EntityStore) -> any,
}
type EntityStore_statics = { new: () -> EntityStore }
local EntityStore = {} :: EntityStore & EntityStore_statics;
(EntityStore :: any).__index = EntityStore
function EntityStore.new(): EntityStore
	local self = setmetatable({}, EntityStore)
	return (self :: any) :: EntityStore
end
function EntityStore:makeCacheKey(...: any): any
	local args = { ... }
	error("not implemented method")
end
function EntityStore:makeCacheKey()
	return self.group.keyMaker:lookupArray(arguments)
end
