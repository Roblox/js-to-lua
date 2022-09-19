-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/complex/ReactUpdates-test_m5.jsx
local function render()
	table.insert(
		updates,
		"Inner-render-" .. tostring(self.props.x) .. "-" .. tostring(self.state.x)
	) --[[ ROBLOX CHECK: check if 'updates' is an Array ]]
	return React.createElement("div", nil)
end
