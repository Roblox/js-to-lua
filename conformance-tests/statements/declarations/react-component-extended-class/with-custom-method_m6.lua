-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/react-component-extended-class/with-custom-method_m6.js
type MyComponent = React_Component<any, any> & { myMethod: (self: MyComponent) -> any }
type MyComponent_statics = {}
local MyComponent = React.Component:extend("MyComponent") :: MyComponent & MyComponent_statics
function MyComponent.render(self: MyComponent)
	return nil
end
function MyComponent:myMethod() end
