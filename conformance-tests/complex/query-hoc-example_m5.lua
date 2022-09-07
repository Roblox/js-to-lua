local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local Object = LuauPolyfill.Object
local operationOptions: any = {}
local props
local function foo()
	return function(ref0: any)
		local _, data, r =
			ref0.client,
			ref0.data,
			Object.assign({}, ref0, { client = Object.None, data = Object.None })
		if Boolean.toJSBoolean(operationOptions.withRef) then
			self.withRef = true
			props = Object.assign({}, props, { ref = self.setWrappedInstance })
		end
	end
end
