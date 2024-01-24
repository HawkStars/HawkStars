/*
	Write a function that takes an input string that may contain parenthesis and validates that it is well-formed.
*/

const inputs = ['(This input is valid)', '((', 'paulo', '()()()', ')', ')('];
const validate = function (input) {
  let count = 0;

  for (let i = 0; i < input.length; i++) {
    if (count > 0 && input[i] == '(') count++;
    if (count == 0 && input[i] == ')') return false;

    if (input[i] == ')') count--;
  }

  return count == 0;
};

for (let a = 0; a < inputs.length; a++) {
  console.log(validate(inputs[a]) + ':\t' + inputs[a]);
}
