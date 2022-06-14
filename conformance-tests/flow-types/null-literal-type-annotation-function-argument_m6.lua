local function foo(
	arg: string | nil --[[ ROBLOX CHECK: verify if `null` wasn't used differently than `undefined` ]]
)
	return arg
end
