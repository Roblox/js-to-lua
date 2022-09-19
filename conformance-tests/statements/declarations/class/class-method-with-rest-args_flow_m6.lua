-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/class/class-method-with-rest-args_flow_m6.js
type EntityStore = { makeCacheKey: (self: EntityStore, ...any) -> any }
type EntityStore_statics = { new: () -> EntityStore }
local EntityStore = {} :: EntityStore & EntityStore_statics;
(EntityStore :: any).__index = EntityStore
function EntityStore.new(): EntityStore
	local self = setmetatable({}, EntityStore)
	return (self :: any) :: EntityStore
end
function EntityStore:makeCacheKey(...: any): any
	local args = { ... }
	return self.group.keyMaker:lookupArray(args)
end
