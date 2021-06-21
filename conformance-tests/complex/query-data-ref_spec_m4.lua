local function getCurrent(queryDataRef)
	local context = {}
	local queryData = queryDataRef.current
		or function()
			queryDataRef.current = {
				context = context,
				onNewData = function(self) end,
			}
			return queryDataRef.current
		end
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
