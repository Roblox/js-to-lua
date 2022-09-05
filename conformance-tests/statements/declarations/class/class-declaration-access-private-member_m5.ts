class Person {
  constructor(private privateName = "World") {}

  getGreeting() {
    return 'Hello' + this.privateName
  }
}
