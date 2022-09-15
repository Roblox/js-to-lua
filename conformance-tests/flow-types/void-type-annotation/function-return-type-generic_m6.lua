type void = nil --[[ ROBLOX FIXME: adding `void` type alias to make it easier to use Luau `void` equivalent when supported ]]
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
type Promise<T> = LuauPolyfill.Promise<T>
type Foo = () -> Promise<void>
