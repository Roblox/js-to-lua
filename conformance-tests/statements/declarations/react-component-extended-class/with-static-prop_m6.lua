-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/react-component-extended-class/with-static-prop_m6.js
type StaticContextComponent = React_Component<any, any> & {}
type StaticContextComponent_statics = {}
local StaticContextComponent =
	React.Component:extend("StaticContextComponent") :: StaticContextComponent & StaticContextComponent_statics
StaticContextComponent.context = { foo = "bar" }
