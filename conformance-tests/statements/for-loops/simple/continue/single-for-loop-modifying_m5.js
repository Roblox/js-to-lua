for (let i = 0; i < 10; i++) {
  if (i === 3) {
    i+=2;
    continue
  }
  foo(i);
}
