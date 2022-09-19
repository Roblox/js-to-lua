-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/ts-types/enum/unions_m5.ts
local exports = {}
local Style =
	{ black = "#00001", ["$$white|"] = "11ffee", default = nil, aNumber = 5, anIdent = ident }
export type Style = { [string]: string | nil | number | any }
exports.Style = Style
return exports
