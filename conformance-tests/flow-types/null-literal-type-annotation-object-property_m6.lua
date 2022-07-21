local foo: {
	bar: string | nil, --[[ ROBLOX CHECK: verify if `null` wasn't used differently than `undefined` ]]
} | nil --[[ ROBLOX CHECK: verify if `null` wasn't used differently than `undefined` ]] =
	{ bar = "baz" }
