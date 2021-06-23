local obj = {
	objFoo = "bar",
	objFizz = "buzz",
	objFuzz = "jazz",
}
local ref = {
	foo = "bar",
	fizz = "buzz",
	fuzz = "jazz",
}
local foo, fizz, fuzz = ref.foo, ref.fizz, ref.fuzz
local ref_ = {
	foo = "bar",
	fizz = "buzz",
	fuzz = "jazz",
}
local foo1, fizz1, fuzz1 = ref_.foo, ref_.fizz, ref_.fuzz
local ref__ = Object.assign({}, obj)
local objFoo, objFizz, objFuzz = ref__.foo, ref__.fizz, ref__.fuzz
