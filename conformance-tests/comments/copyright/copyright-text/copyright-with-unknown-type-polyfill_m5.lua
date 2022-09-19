-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/comments/copyright/copyright-text/copyright-with-unknown-type-polyfill_m5.ts
--[[*
 * Copyright (c) XYZ, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 ]]
type unknown = any --[[ ROBLOX FIXME: adding `unknown` type alias to make it easier to use Luau unknown equivalent when supported ]]
local function foo(bar: unknown) end
