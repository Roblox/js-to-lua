local ref = { foo = "bar", fizz = "buzz", fuzz = "jazz" }
local foo, rest = ref.foo, Object.assign({}, ref, { foo = Object.None })
