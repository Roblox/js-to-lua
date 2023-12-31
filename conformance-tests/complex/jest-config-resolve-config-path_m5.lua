-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/complex/jest-config-resolve-config-path_m5.ts
local Packages --[[ ROBLOX comment: must define Packages module ]]
local exports = {}
local jestTypesModule = require(Packages["@jest"].types)
type Config = jestTypesModule.Config
type Config_Path = jestTypesModule.Config_Path
exports.default = function(
	pathToResolve: Config_Path,
	cwd: Config_Path,
	skipMultipleConfigWarning_: boolean?
): Config_Path
	local skipMultipleConfigWarning: boolean = if skipMultipleConfigWarning_ ~= nil
		then skipMultipleConfigWarning_
		else false
	return "path"
end
return exports
