const printFn = (num) => {
  console.log(num);
};
let items = [];
for (let index = 0; index < 5; index++) {
  items.push({
    printMethod: function() {
      printFn(index);
    }
  });
}
items[0].printMethod();
