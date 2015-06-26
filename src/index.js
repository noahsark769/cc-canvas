require("babelify/polyfill");

class Test {
  constructor() {
    this.message = "hello";
  }
  say() {
    console.log(this.message);
  }
}

let t = new Test();
t.say();
