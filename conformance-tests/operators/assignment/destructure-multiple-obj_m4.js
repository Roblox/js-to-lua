const obj = {
  objFoo: 'bar',
  objFizz: 'buzz',
  objFuzz: 'jazz'
};

let foo, fizz, fuzz;
({ foo, fizz, fuzz } = {
  foo: 'bar',
  fizz: 'buzz',
  fuzz: 'jazz'
});

let foo1, fizz1, fuzz1;
({ foo: foo1, fizz: fizz1, fuzz: fuzz1 } = {
  foo: 'bar',
  fizz: 'buzz',
  fuzz: 'jazz'
});

let objFoo, objFizz, objFuzz;
({ objFoo, objFizz, objFuzz } = { ...obj });
