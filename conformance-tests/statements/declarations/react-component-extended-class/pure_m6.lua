-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/react-component-extended-class/pure_m6.js
type Empty = React_Component<any, any> & {}
type Empty_statics = {}
local Empty = React.PureComponent:extend("Empty") :: Empty & Empty_statics
function Empty.render(self: Empty)
	return nil
end
