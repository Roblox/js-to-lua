const printFn = (num) => {
  console.log(num);
};
let items = [];
for (let i = 0, j = 0 ; i < 5; i++, j+=2) {
  items.push({
    printMethod: function() {
      printFn(i);
    }
  });
}
items[0].printMethod();
