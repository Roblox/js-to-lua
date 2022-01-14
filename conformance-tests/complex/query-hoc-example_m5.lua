local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local Object = LuauPolyfill.Object
local operationOptions: any = {}
local props
local function foo()
	return function(ref: any)
		local _, data, r =
			ref.client,
			ref.data,
			Object.assign({}, ref, { client = Object.None, data = Object.None })
		if Boolean.toJSBoolean(operationOptions.withRef) then
			self.withRef = true
			props = Object.assign({}, props, { ref = self.setWrappedInstance })
		end
	end
end
