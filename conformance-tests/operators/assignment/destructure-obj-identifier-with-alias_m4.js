const obj = {
  foo: 'bar',
  fizz: 'buzz',
  fuzz: 'jazz'
};
let foo1, fizz1, fuzz;
({ foo: foo1, fizz: fizz1, fuzz } = obj);
