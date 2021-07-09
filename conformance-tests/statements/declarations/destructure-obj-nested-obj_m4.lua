local ref = { foo = "bar", bar = { fizz = "buzz", fuzz = "jazz" } }
local foo, fizz, fuzz = ref.foo, ref.bar.fizz, ref.bar.fuzz
