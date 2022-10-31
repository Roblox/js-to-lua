-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/react-component-extended-class/with-lifecycle-hooks_m6.js
type MyComponent = React_Component<any, any> & {}
type MyComponent_statics = {}
local MyComponent = React.Component:extend("MyComponent") :: MyComponent & MyComponent_statics
function MyComponent.render(self: MyComponent)
	return nil
end
function MyComponent.componentWillMount(self: MyComponent) end
function MyComponent.componentDidMount(self: MyComponent) end
function MyComponent.shouldComponentUpdate(self: MyComponent) end
function MyComponent.componentWillUpdate(self: MyComponent) end
function MyComponent.componentDidUpdate(self: MyComponent) end
function MyComponent.componentWillUnmount(self: MyComponent) end
function MyComponent.componentDidCatch(self: MyComponent) end
