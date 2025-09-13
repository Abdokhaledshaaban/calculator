/*

let display = document.querySelector('#display');
let buttons = document.querySelectorAll('button');
let specialChars = ['%', '*', '/', '-', '+', '='];
let output = '';

function calculate(btnValue) {
  if (btnValue === '=' && output !== '') {
    output = eval(output.replace('%', '/100'));
  } else if (btnValue === 'AC') {
    output = '';
  } else if (btnValue === 'DEL') {
    output = output.toString().slice(0, -1);
  } else {
    if (output === '' && specialChars.includes(btnValue)) return;
    output += btnValue;
  }

  display.value = output;
}

buttons.forEach((button) => {
  button.addEventListener('click', (e) => calculate(e.target.dataset.value));
});

*/

let display = document.querySelector('#display');
let buttons = document.querySelectorAll('button');
let specialChars = ['%', '×', '÷', '-', '+', '='];
let output = '';
let justCalculated = false;

function calculate(btnValue) {
  if (btnValue === '=' && output !== '') {
    try {
      // استبدال الرموز الرياضية بالقيم اللي JavaScript يفهمها
      let expression = output
        .replace(/÷/g, '/')
        .replace(/×/g, '*')
        .replace(/%/g, '/100');
      output = eval(expression);
      justCalculated = true;
    } catch {
      output = 'Error';
      justCalculated = true;
    }
  } else if (btnValue === 'AC') {
    output = '';
    justCalculated = false;
  } else if (btnValue === 'DEL') {
    output = output.toString().slice(0, -1);
  } else {
    // لو لسه عامل حساب ودخل رقم جديد → يمسح النتيجة
    if (justCalculated && !specialChars.includes(btnValue)) {
      output = '';
      justCalculated = false;
    }
    // لو دخل علامة بعد الحساب → يكمل على الناتج
    if (justCalculated && specialChars.includes(btnValue) && btnValue !== '=') {
      justCalculated = false;
    }

    // شرط 1: لا يبدأ بعلامة خاصة (إلا السالب -)
    if (output === '' && specialChars.includes(btnValue) && btnValue !== '-')
      return;

    // شرط 2: منع تكرار العلامات
    let lastChar = output.slice(-1);
    if (
      specialChars.includes(lastChar) &&
      specialChars.includes(btnValue) &&
      btnValue !== '-'
    ) {
      return;
    }

    // شرط 3: منع أكثر من نقطة في نفس الرقم
    if (btnValue === '.') {
      let parts = output.split(/[+\-×÷]/); // تقسيم على حسب العلامات الرياضية
      let lastNumber = parts[parts.length - 1];
      if (lastNumber.includes('.')) return;
    }

    output += btnValue;
  }

  display.value = output;
}

buttons.forEach((button) => {
  button.addEventListener('click', (e) => calculate(e.target.dataset.value));
});
