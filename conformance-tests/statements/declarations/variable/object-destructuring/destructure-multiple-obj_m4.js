const obj = {
  objFoo: 'bar',
  objFizz: 'buzz',
  objFuzz: 'jazz',
};

const { foo, fizz, fuzz } = {
  foo: 'bar',
  fizz: 'buzz',
  fuzz: 'jazz',
};
const { foo: foo1, fizz: fizz1, fuzz: fuzz1 } = {
  foo: 'bar',
  fizz: 'buzz',
  fuzz: 'jazz',
};
const { objFoo, objFizz, objFuzz } = { ...obj };
