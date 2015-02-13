
function evalRPN(input) {
    var inputArr = input.split(/\s+/);
    var stack = [];

    for (var i in inputArr) {
        var token = inputArr[i];
        if (token == +token) {
            stack.push(token);
        } else {
            var n2 = stack.pop();
            var n1 = stack.pop();

            var re = /^[+-/*]$/;
            if (!re.test(token))
                throw new Error("Invalid expression: " + input);
            stack.push(eval(n1 + token + ' ' + n2));
        }
    }

    if (stack.length != 1)
        throw new Error("Invalid expression: " + input);
    return stack.pop();
}