-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/comments/copyright/copyright-text/copyright-with-void-type-polyfill_m5.ts
--[[*
 * Copyright (c) XYZ, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 ]]
type void = nil --[[ ROBLOX FIXME: adding `void` type alias to make it easier to use Luau `void` equivalent when supported ]]
local function foo(bar: Response<void>): () end
