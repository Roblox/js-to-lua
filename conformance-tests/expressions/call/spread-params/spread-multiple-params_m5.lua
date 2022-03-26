local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Array = LuauPolyfill.Array
foo(table.unpack(Array.concat({}, Array.spread(bar), Array.spread(baz), Array.spread(fizz))))
