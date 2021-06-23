const obj = {
  foo: 'bar',
  fizz: 'buzz',
  fuzz: 'jazz'
};
let foo, fizz, fuzz;
({ foo, fizz, fuzz } = { ...obj });
