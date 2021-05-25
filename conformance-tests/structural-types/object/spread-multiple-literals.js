let obj1 = {foo: 'foo', ...{ bar: 'bar'}}
let obj2 = {...{fizz: 'fizz'}, baz: 'baz'}
let combined = {...obj1, ...obj2, buzz: 'buzz', ...{fuzz: 'fuzz'}}
