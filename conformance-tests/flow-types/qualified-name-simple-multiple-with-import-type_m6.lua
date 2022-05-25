local barModule = require(script.Parent.bar)
type Foo = barModule.Foo
type Foo_Bar = barModule.Foo_Bar
type Foo_Baz = barModule.Foo_Baz
type Foo_Fizz = barModule.Foo_Fizz
type QualifiedSimpleBar = Foo_Bar
type QualifiedSimpleBaz = Foo_Baz
type QualifiedSimpleFizz = Foo_Fizz
