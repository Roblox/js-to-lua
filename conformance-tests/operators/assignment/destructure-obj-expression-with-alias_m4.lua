local obj = { foo = "bar", fizz = "buzz", fuzz = "jazz" }
local foo1, fizz1, fuzz
local ref = Object.assign({}, obj)
foo1, fizz1, fuzz = ref.foo, ref.fizz, ref.fuzz
