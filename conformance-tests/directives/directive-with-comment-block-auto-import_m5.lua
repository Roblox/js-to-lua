-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/directives/directive-with-comment-block-auto-import_m5.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local console = LuauPolyfill.console
--[[*
 * Directive Comment Block
 *
 * comment content
 *
 * @flow strict-local
 * @format
 ]]

console.log(foo)
