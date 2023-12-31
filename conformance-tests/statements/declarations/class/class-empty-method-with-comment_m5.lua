-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/class/class-empty-method-with-comment_m5.ts
type Foo = { bar: (self: Foo) -> any, baz: (self: Foo) -> any }
type Foo_statics = { new: () -> Foo }
local Foo = {} :: Foo & Foo_statics;
(Foo :: any).__index = Foo
function Foo.new(): Foo
	local self = setmetatable({}, Foo)
	return (self :: any) :: Foo
end
function Foo.barStatic()
	--[[ hello bar static ]]
end
function Foo.bazStatic()
	--[[ hello baz static ]]
end
function Foo:bar()
	--[[ hello bar ]]
end
function Foo:baz()
	--[[ hello baz ]]
end
