-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/complex/query-data-ref_spec_m4.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local function getCurrent(queryDataRef)
	local context = {}
	local queryData = Boolean.toJSBoolean(queryDataRef.current) and queryDataRef.current
		or (function()
			queryDataRef.current = { context = context, onNewData = function(self) end }
			return queryDataRef.current
		end)()
	return queryData
end
describe("Query Data Ref", function()
	it("should use existing current", function()
		local givenCurrent = { context = "context", onNewData = function(self) end }
		local given = { current = givenCurrent }
		local result = getCurrent(given)
		expect(result).toBe(givenCurrent)
	end)
	it("should initialize current", function()
		local given = {}
		local result = getCurrent(given)
		expect(result).toBeDefined()
		expect(given.current).toBeDefined()
		expect(result).toBe(given.current)
	end)
end)
