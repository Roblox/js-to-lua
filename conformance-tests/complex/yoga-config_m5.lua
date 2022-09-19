-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/complex/yoga-config_m5.ts
type Config = {
	config: YGConfig,
	free: (self: Config) -> (),
	setExperimentalFeatureEnabled: (self: Config, feature: number, enabled: boolean) -> (),
	setPointScaleFactor: (self: Config, pixelsInPoint: number) -> (),
	isExperimentalFeatureEnabled: (self: Config, feature: number) -> boolean,
}
type Config_statics = { new: () -> Config }
local Config = {} :: Config & Config_statics;
(Config :: any).__index = Config
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
