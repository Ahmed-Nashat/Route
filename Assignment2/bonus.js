function positiveNumber(arr, k) {
  let current = 1;
  let missing = 0;
  let index = 0;

  while (missing < k) {
    if (index < arr.length && arr[index] === current) {
      index++;
    } else {
      missing++;
      if (missing === k) {
        return current;
      }
    }
    current++;
  }
}
console.log(positiveNumber([1, 2, 3, 5, 7, 8, 10], 4));
