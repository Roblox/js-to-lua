type Config = {
	config: any,
	free: any,
	setExperimentalFeatureEnabled: any,
	setPointScaleFactor: any,
	isExperimentalFeatureEnabled: any,
} --[[ ROBLOX TODO: replace 'any' type/ add missing ]]
local Config = {}
Config.__index = Config
function Config.new(): Config
	local self = setmetatable({}, Config)
	self.config = YGConfigNew()
	return (self :: any) :: Config
end
function Config.create(): Config
	return Config.new()
end
function Config:free(): ()
	YGConfigFree(self.config)
end
function Config:setExperimentalFeatureEnabled(feature: number, enabled: boolean): ()
	YGConfigSetExperimentalFeatureEnabled(self.config, feature, enabled)
end
function Config:setPointScaleFactor(pixelsInPoint: number): ()
	YGConfigSetPointScaleFactor(self.config, pixelsInPoint)
end
function Config:isExperimentalFeatureEnabled(feature: number): boolean
	return YGConfigIsExperimentalFeatureEnabled(self.config, feature)
end
