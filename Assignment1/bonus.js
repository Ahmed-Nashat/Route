var createCounter = function (init) {
  let current = init;

  function increment() {
    current += 1;
    return current;
  }

  function decrement() {
    current -= 1;
    return current;
  }

  function reset() {
    current = init;
    return current;
  }
  return { increment, decrement, reset };
};
