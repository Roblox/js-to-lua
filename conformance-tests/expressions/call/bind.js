const greet = {
  person: function (name) {
    return 'Hello ' + name;
  }
};

const greetChris = greet.person.bind(greet, 'Chris');
const greetJan = greet.person.bind(greet, 'Jan');

greetChris();
greetJan();
