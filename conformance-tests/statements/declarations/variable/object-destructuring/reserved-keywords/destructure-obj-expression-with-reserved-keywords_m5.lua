local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Object = LuauPolyfill.Object
local obj = { ["repeat"] = "repeat", ["error"] = "error", ["table"] = "table" }
local repeat_, error_, table_
do
	local ref = Object.assign({}, obj)
	repeat_, error_, table_ = ref["repeat"], ref.error, ref.table
end
