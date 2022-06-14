const printFn = (num) => {
  return num
};
let items = [];
for (let index = 0; index < 5; index++) {
  items.push({
    printResult: printFn(index)
  });
}
