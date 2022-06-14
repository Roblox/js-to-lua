local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local Error = LuauPolyfill.Error
local setTimeout = LuauPolyfill.setTimeout
local observerOptions = {
	next = function(self, result: any)
		do --[[ ROBLOX COMMENT: try-catch block conversion ]]
			local ok, result, hasReturned = xpcall(function()
				repeat --[[ ROBLOX comment: switch statement conversion ]]
					local condition_ = count
					count += 1
					if condition_ == 0 then
						if not Boolean.toJSBoolean((result.data :: any).allPeople) then
							reject("Should have data by this point")
							break
						end
						expect(stripSymbols((result.data :: any).allPeople)).toEqual(data.allPeople)
						setTimeout(function()
							observable:refetch():then_(function()
								reject("Expected error value on first refetch.")
							end, noop)
						end, 0)
						break
					elseif condition_ == 4 then
						expect(result.loading).toBeFalsy()
						expect(result.networkStatus).toBe(7)
						expect(result.errors).toBeFalsy()
						if not Boolean.toJSBoolean(result.data) then
							reject("Should have data by this point")
							break
						end
						expect(stripSymbols(result.data.allPeople)).toEqual(dataTwo.allPeople)
						resolve()
						break
					else
						error(Error.new("Unexpected fall through"))
					end
				until true
			end, function(e)
				reject(e)
			end)
			if hasReturned then
				return result
			end
		end
	end,
}
