--[[*
 * Copyright (c) XYZ, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 ]]
local barModule = require(script.Parent.bar)
type Foo = barModule.Foo
type Foo_Fizz = barModule.Foo_Fizz
local fizz: Foo_Fizz = "buzz"
