const calculator = (() => {
  const error = document.getElementById('error');

  const mul = (a, b) => {
    return a * b;
  }

  const div = (a, b) => {
    if (b === 0) {
      error.textContent = "Can't divide by 0";
      return;
    }
    return a / b;
  }

  const handleAddAndSub = (numbers, operators) => {
    let result = numbers[0];
    for (let i = 0; i < operators.length; i++)
    {
      if (operators[i] === '+')
        result += numbers[i + 1];
      else
        result -= numbers[i + 1];
    }
    return result;
  }

  const handleMulAndDivision = (numbers, operators) => {
    for (let i = 0; i < operators.length; i++)
    {
      if (['*', '/'].includes(operators[i]))
      {
        let n;
        if (operators[i] === '*')
          n = mul(numbers[i], numbers[i + 1]);
        else
          n = div(numbers[i], numbers[i + 1]);
        operators.splice(i, 1);
        numbers.splice(i, 1);
        numbers[i] = n;
        i--;
      }
    }
  }

  const calculateSegment = (segment) => {
    if (segment === '') return;
    console.log(segment);
    let numbersList = [];
    let operatorsList = [];
    let num = '+';
    for (let i = 0; i < segment.length; i++)
    {
      if (segment[i] === '-' && num.length === 1)
        num = num[0] === '-' ? '+' : '-';
      else if (['*', '+', '/', '-'].includes(segment[i]))
      {
        operatorsList.push(segment[i]);
        const number = Number(num);
        if (number === undefined)
          return;
        numbersList.push(number);
        num = '+';
      }
      else
        num += segment[i];
    }
    const number = Number(num);
    if (number === undefined)
      return;
    numbersList.push(number);
    if (numbersList.length != operatorsList.length + 1)
      return;
    handleMulAndDivision(numbersList, operatorsList);
    return handleAddAndSub(numbersList, operatorsList);
  }

  const solve = (expression) => {
    const pair = [expression.lastIndexOf('('), expression.indexOf(')')];



    if (pair[0] === -1 && pair[1] === -1)
      return calculateSegment(expression);

    else if (pair[0] != -1 && pair[1] != -1) {
      const bracketsSegment = expression.substring(pair[0] + 1, pair[1]);
      const bracketsResult = calculateSegment(bracketsSegment);
      if (bracketsResult === undefined) return;
      expression = expression.replace(`(${bracketsSegment})`,bracketsResult);
      console.log(expression);
      return solve(expression);
    }
  }

  return {
    solve,
  }
}) ();

export default calculator;