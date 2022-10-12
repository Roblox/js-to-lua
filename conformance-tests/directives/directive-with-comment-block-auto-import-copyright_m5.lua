-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/directives/directive-with-comment-block-auto-import-copyright_m5.js
--[[*
 * @copyright Directive Comment Block
 *
 * comment content
 *
 * @flow strict-local
 * @format
 ]]
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local console = LuauPolyfill.console

console.log(foo)
