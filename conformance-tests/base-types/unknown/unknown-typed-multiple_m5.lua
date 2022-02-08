type unknown = any --[[ ROBLOX FIXME: adding `unknown` type alias to make it easier to use Luau unknown equivalent when supported ]]
local foo: unknown = "unknown"
local bar: unknown = "unknown"
local function baz(fizz: unknown): unknown
	return fizz :: unknown
end
