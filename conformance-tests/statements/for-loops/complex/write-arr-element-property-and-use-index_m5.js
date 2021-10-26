const arr = [{}, {}, {}];
const calculateFn = (v) => ({ v });
for (let i = 0; i < 3; i++) {
  arr[i].cachedValue = calculateFn(i);
}
