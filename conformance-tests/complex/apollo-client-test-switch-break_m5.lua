local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local Error = LuauPolyfill.Error
local observerOptions = {
	next = function(self, result: any)
		do --[[ ROBLOX COMMENT: try-catch block conversion ]]
			local ok, result, hasReturned = xpcall(function()
				repeat --[[ ROBLOX comment: switch statement conversion ]]
					local entered_, break_ = false, false
					local condition_ = (function()
						local result = count
						count += 1
						return result
					end)()
					for _, v in ipairs({ 0, 4 }) do
						if condition_ == v then
							if v == 0 then
								entered_ = true
								if not Boolean.toJSBoolean((result.data :: any).allPeople) then
									reject("Should have data by this point")
									break_ = true
									break
								end
								expect(stripSymbols((result.data :: any).allPeople)).toEqual(
									data.allPeople
								)
								setTimeout(function()
									observable:refetch():then_(function()
										reject("Expected error value on first refetch.")
									end, noop)
								end, 0)
								break_ = true
								break
							end
							if v == 4 or entered_ then
								entered_ = true
								expect(result.loading).toBeFalsy()
								expect(result.networkStatus).toBe(7)
								expect(result.errors).toBeFalsy()
								if not Boolean.toJSBoolean(result.data) then
									reject("Should have data by this point")
									break_ = true
									break
								end
								expect(stripSymbols(result.data.allPeople)).toEqual(
									dataTwo.allPeople
								)
								resolve()
								break_ = true
								break
							end
						end
					end
					if not break_ then
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
