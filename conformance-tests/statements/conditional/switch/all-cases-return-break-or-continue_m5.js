function hello() {
  for(let i = 0; i < 2; i++) {
    switch(i) {
      case 0:
        break
      case 1:
        continue
      case 2:
        return
    }
  }
}
