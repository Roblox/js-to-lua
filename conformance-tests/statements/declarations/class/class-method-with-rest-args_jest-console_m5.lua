-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/class/class-method-with-rest-args_jest-console_m5.ts
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Array = LuauPolyfill.Array
type CustomConsole = {
	log: (
		self: CustomConsole,
		firstArg: unknown,
		...any --[[ ROBLOX CHECK: check correct type of elements. Upstream type: <Array<unknown>> ]]
	) -> (),
}
type CustomConsole_statics = { new: () -> CustomConsole }
local CustomConsole = {} :: CustomConsole & CustomConsole_statics;
(CustomConsole :: any).__index = CustomConsole
function CustomConsole.new(): CustomConsole
	local self = setmetatable({}, CustomConsole)
	return (self :: any) :: CustomConsole
end
function CustomConsole:log(
	firstArg: unknown,
	...: any --[[ ROBLOX CHECK: check correct type of elements. Upstream type: <Array<unknown>> ]]
): ()
	local args = { ... }
	self:_log("log", format(firstArg, table.unpack(Array.spread(args))))
end
