local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Object = LuauPolyfill.Object
local repeat_, until_
do
	local ref = { ["repeat"] = "repeat", error = "error", table = "table" }
	repeat_, until_ = ref["repeat"], Object.assign({}, ref, { ["repeat"] = Object.None })
end
