local barModule = require(script.Parent.bar)
type Foo = barModule.Foo
type Foo_Bar = barModule.Foo_Bar
type Foo_Baz = barModule.Foo_Baz
type Foo_Fizz_Buzz = barModule.Foo_Fizz_Buzz
type Foo_Fizz_Jazz = barModule.Foo_Fizz_Jazz
type QualifiedSimpleBar = Foo_Bar
type QualifiedSimpleBaz = Foo_Baz
type QualifiedSimpleFizzBuzz = Foo_Fizz_Buzz
type QualifiedSimpleFizzJazz = Foo_Fizz_Jazz