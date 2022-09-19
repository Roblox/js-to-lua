-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/complex/react-create-react-noop-try-catch_m4.ts
local function noopAct()
	do --[[ ROBLOX COMMENT: try-catch block conversion ]]
		local ok, result, hasReturned = xpcall(function()
			local thenable = batchedUpdates(scope)
			if
				typeof(thenable) == "object"
				and thenable ~= nil
				and typeof(thenable.then_) == "function"
			then
				return {
					then_ = function(self, resolve: any, reject: any)
						thenable:then_(function()
							flushActWork(function()
								unwind()
								resolve()
							end, function(error_)
								unwind()
								reject(error_)
							end)
						end, function(error_)
							unwind()
							reject(error_)
						end)
					end,
				}
			else
				do --[[ ROBLOX COMMENT: try-finally block conversion ]]
					local ok, result, hasReturned = pcall(function()
						local didFlushWork
					end)
					do
						unwind()
					end
					if hasReturned then
						return result, true
					end
					if not ok then
						error(result)
					end
				end
			end
		end, function(error_)
			unwind()
			error(error_)
		end)
		if hasReturned then
			return result
		end
	end
end
