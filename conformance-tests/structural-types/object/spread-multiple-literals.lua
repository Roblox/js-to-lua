local obj1 = Object.assign({}, {foo = "foo"}, {bar = "bar"})
local obj2 = Object.assign({}, {fizz = "fizz"}, {baz = "baz"})
local combined = Object.assign({}, obj1, obj2, {buzz = "buzz"}, {fuzz = "fuzz"})
