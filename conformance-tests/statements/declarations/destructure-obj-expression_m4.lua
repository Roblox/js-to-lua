local obj = { foo = "bar", fizz = "buzz", fuzz = "jazz" }
local ref = Object.assign({}, obj)
local foo, fizz, fuzz = ref.foo, ref.fizz, ref.fuzz
