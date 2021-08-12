local function enter(node)
	repeat --[[ ROBLOX comment: switch statement conversion ]]
		local entered_, break_ = false, false
		local condition_ = node.kind
		for _, v in ipairs({
			Kind.SELECTION_SET,
			Kind.DIRECTIVE,
			Kind.OPERATION_DEFINITION,
			Kind.INLINE_FRAGMENT,
			Kind.FRAGMENT_DEFINITION,
			Kind.ARGUMENT,
		}) do
			if condition_ == v then
				if v == Kind.SELECTION_SET then
					entered_ = true
					local body
					break_ = true
					break
				end
				if v == Kind.DIRECTIVE or entered_ then
					entered_ = true
					local body
					break_ = true
					break
				end
				if v == Kind.OPERATION_DEFINITION or entered_ then
					entered_ = true
					local type: any
					repeat --[[ ROBLOX comment: switch statement conversion ]]
						local entered_, break_ = false, false
						local condition_ = node.operation
						for _, v in ipairs({ "query", "mutation", "subscription" }) do
							if condition_ == v then
								if v == "query" then
									entered_ = true
									type = schema:getQueryType()
									break_ = true
									break
								end
								if v == "mutation" or entered_ then
									entered_ = true
									type = schema:getMutationType()
									break_ = true
									break
								end
								if v == "subscription" or entered_ then
									entered_ = true
									type = schema:getSubscriptionType()
									break_ = true
									break
								end
							end
						end
					until true
					break_ = true
					break
				end
				if v == Kind.INLINE_FRAGMENT or entered_ then
					entered_ = true
				end
				if v == Kind.FRAGMENT_DEFINITION or entered_ then
					entered_ = true
					local body
					break_ = true
					break
				end
				if v == Kind.ARGUMENT or entered_ then
					local body
					break_ = true
					break
				end
			end
		end
	until true
end
