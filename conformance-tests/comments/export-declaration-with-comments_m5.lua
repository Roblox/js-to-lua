-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/comments/export-declaration-with-comments_m5.ts
local exports = {}
--[[ Comment 1 ]]
local function thisIsTest(): () end
exports.thisIsTest = thisIsTest
--[[ Comment 2 ]]
local foo = "foo"
exports.foo = foo
--[[ Comment 3 ]]
export type Foo = {}
type Foo_statics = { new: () -> Foo }
local Foo = {} :: Foo & Foo_statics;
(Foo :: any).__index = Foo
function Foo.new(): Foo
	local self = setmetatable({}, Foo)
	return (self :: any) :: Foo
end
exports.Foo = Foo
--[[ Comment 4 ]]
return exports
