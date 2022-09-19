-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/comments/copyright/copyright-text/copyright-with-polyfills_m5.js
--[[*
 * Copyright (c) XYZ, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 ]]
local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local console = LuauPolyfill.console
local function foo(bar)
	if Boolean.toJSBoolean(bar) then
		console.log(bar)
	end
end
