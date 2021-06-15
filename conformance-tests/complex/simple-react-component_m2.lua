local function Component(props)
	return React.createElement("Text", { text = tostring(props.id) })
end
Component({ id = "123" })
