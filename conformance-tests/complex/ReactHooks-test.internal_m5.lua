-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/complex/ReactHooks-test.internal_m5.js
it(
	("warns when more hooks (%s) are used during update than mount"):format(tostring((function()
		error("not implemented") --[[ ROBLOX TODO: Lua doesn't support 'Identifier' as a standalone type ]] --[[ hookNameA ]]
		return hookNameB
	end)())),
	function() end
)
