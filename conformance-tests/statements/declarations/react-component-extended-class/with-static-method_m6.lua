-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/react-component-extended-class/with-static-method_m6.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
type Object = LuauPolyfill.Object
type ErrorBoundary = React_Component<any, any> & { state: Object }
type ErrorBoundary_statics = {}
local ErrorBoundary =
	React.Component:extend("ErrorBoundary") :: ErrorBoundary & ErrorBoundary_statics
function ErrorBoundary.init(self: ErrorBoundary)
	self.state = { hasError = false }
end
function ErrorBoundary.getDerivedStateFromError()
	return { hasError = true }
end
