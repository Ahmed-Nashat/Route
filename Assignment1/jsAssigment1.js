// Q1
let string = "123";
string = Number(string) + 7;
console.log(string);

// Q2
const given = null;
if (given) {
  console.log("valid");
} else {
  console.log("invalid");
}

// Q3
let newArr = [];
for (i = 0; i <= 10; i++) {
  if (i % 2) {
    newArr.push(i);
  } else {
    continue;
  }
}
console.log(newArr);

// Q4
let arr = [1, 2, 3, 4, 5];
console.log(arr.filter((elm) => elm % 2 === 0));

// Q5
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

const mergedArr = [...arr1, ...arr2];
console.log(mergedArr);

// Q6
const day = 3;
switch (day) {
  case 1:
    console.log("Sunday");
    break;
  case 2:
    console.log("Monday");
    break;
  case 3:
    console.log("Teusday");
    break;
  case 4:
    console.log("Wednesday");
    break;
  case 5:
    console.log("Thursday");
    break;
  case 6:
    console.log("Friday");
    break;
  case 7:
    console.log("Saturday");
    break;

  default:
    console.log("not a day");
}

// Q7
const arrLenght = ["a", "ab", "abc"].map((elm) => elm.length);
console.log(arrLenght);

//Q8
// function divideANumber(num) {
//   const num = 15;
//   if (num / 3 && num / 5) {
//     console.log("divisible by both");
//   }
// }
// divideANumber(15);

// Q9
function squareANumber(num) {
  console.log(num ** 2);
}
squareANumber(15);

// Q10
const person = { name: "john", age: 25 };
function destObject(obj) {
  console.log(`${obj.name} is ${obj.age} years old`);
}
destObject(person);

// Q11
function sum(num1, num2, num3, num4, num5) {
  let result = num1 + num2 + num3 + num4 + num5;
  console.log(result);
}
sum(1, 2, 3, 4, 5);

// 12
function resolve3Sec() {
  const number = setTimeout(() => {
    console.log("success");
  }, 3000);
}
resolve3Sec();

// Q13
const numbers = [1, 3, 7, 2, 4];
function findMaxNumber(arr) {
  return Math.max(...arr);
}
console.log(findMaxNumber(numbers));

function findLargestNumber(arr) {
  let max = arr[0];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}
console.log(findLargestNumber(numbers));


// Q14
const obj1 = {
  name: "John",
  age: 30,
};
function returnKey(obj) {
  const arr = Object.keys(obj);
  console.log(arr);
}
returnKey(obj1);

// Q15
const phrase = "The quick brown fox";
function splitWord(phrase) {
  phrase.spl;
}


// ESSAY
/*
// Q1
break, continue cannot be applied in forEach, using return smiply skip this condition but keeps going
when the item and the index is needed 
******************************** 
break, continue and break can be applied in for...of
using it when exit from the loop early is needed
******************************** 

//Q2
Hoisting: is a javascript's behavior of lifting variable and function declarations to the top of their scope (only declaration not the values)

console.log(x) output: undefined -> bec. it is initialized without declaration 
var x = 5

TDZ: its a spcae start at the top of the scope and ends once the varibale is declared 

--- TDZ starts here ---
console.log(y) // output error because cannot access the variable before initialization
let y = 5
--- TDZ ends here ---

//Q3
== compare the value without data type
=== comapre bothe the value and its data type

//Q4
if the error happens asynchronously the (try) block will finish runnig before the errro actually happens 

//Q5
Type Conversion: when the user try to change the data type manually
let nummber = "5"
number = Number(number)

Type Coercion: when js try to compare to different data type it's automatically converts one to match the other
const result1 = "5" + 2; 
console.log(result1); output: "52" 

const result2 = "5" - 2; 
console.log(result2); output: 3
*/