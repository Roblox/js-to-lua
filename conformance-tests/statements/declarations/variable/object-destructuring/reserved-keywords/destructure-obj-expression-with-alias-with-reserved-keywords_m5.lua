local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Object = LuauPolyfill.Object
local obj = {
	["repeat"] = "repeat",
	["error"] = "error",
	err = "err",
	["table"] = "table",
	tbl = "tbl",
}
local until_, err, error_, tbl, table_
do
	local ref = Object.assign({}, obj)
	until_, err, error_, tbl, table_ = ref["repeat"], ref.error, ref.err, ref.table, ref.tbl
end
