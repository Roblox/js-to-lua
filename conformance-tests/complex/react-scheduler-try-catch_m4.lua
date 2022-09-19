-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/complex/react-scheduler-try-catch_m4.js
local hasRun = false
local function wrapped()
	local prevInteractions = interactionsRef.current
	interactionsRef.current = wrappedInteractions
	subscriber = subscriberRef.current
	do --[[ ROBLOX COMMENT: try-finally block conversion ]]
		local ok, result, hasReturned = pcall(function()
			local returnValue
			do --[[ ROBLOX COMMENT: try-finally block conversion ]]
				local ok, result, hasReturned = pcall(function()
					if subscriber ~= nil then
						subscriber:onWorkStarted(wrappedInteractions, threadID)
					end
				end)
				do
					do --[[ ROBLOX COMMENT: try-finally block conversion ]]
						local ok, result, hasReturned = pcall(function()
							returnValue = callback:apply(nil, arguments)
						end)
						do
							interactionsRef.current = prevInteractions
							if subscriber ~= nil then
								subscriber:onWorkStopped(wrappedInteractions, threadID)
							end
						end
						if hasReturned then
							return result, true
						end
						if not ok then
							error(result)
						end
					end
				end
				if hasReturned then
					return result, true
				end
				if not ok then
					error(result)
				end
			end
			return returnValue, true
		end)
		do
			if not Boolean.toJSBoolean(hasRun) then
				hasRun = true
				wrappedInteractions:forEach(function() end)
			end
		end
		if hasReturned then
			return result
		end
		if not ok then
			error(result)
		end
	end
end
