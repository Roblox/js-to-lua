-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/react-component-extended-class/with-constructor-and-super_m6.js
type Mine = React_Component<any, any> & {}
type Mine_statics = {}
local Mine = React.Component:extend("Mine") :: Mine & Mine_statics
function Mine.init(self: Mine)
	self.state = { isActive = false }
end
function Mine.render(self: Mine)
	return nil
end
