const obj = {
  foo: 'bar',
  fizz: 'buzz',
  fuzz: 'jazz',
};
const { foo: foo1, fizz: fizz1, fuzz } = { ...obj };
