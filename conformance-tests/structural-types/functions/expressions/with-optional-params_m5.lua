local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
type Object = LuauPolyfill.Object
local function foo(bar: any?, baz: string?, fizz: Object?) end
