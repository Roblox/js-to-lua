local obj = { objFoo = "bar", objFizz = "buzz", objFuzz = "jazz" }
local foo, fizz, fuzz
local ref = { foo = "bar", fizz = "buzz", fuzz = "jazz" }
foo, fizz, fuzz = ref.foo, ref.fizz, ref.fuzz
local foo1, fizz1, fuzz1
local ref_ = { foo = "bar", fizz = "buzz", fuzz = "jazz" }
foo1, fizz1, fuzz1 = ref_.foo, ref_.fizz, ref_.fuzz
local objFoo, objFizz, objFuzz
local ref__ = Object.assign({}, obj)
objFoo, objFizz, objFuzz = ref__.foo, ref__.fizz, ref__.fuzz
