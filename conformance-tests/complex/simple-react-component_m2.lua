-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/complex/simple-react-component_m2.js
local function Component(props)
	return React.createElement("Text", { text = tostring(props.id) })
end
Component({ id = "123" })
