import React, { useState } from 'react';

const buttonConfig = [
  { id: 'clear', value: 'AC', type: 'action', className: 'btn-ac' },
  { id: 'divide', value: '/', type: 'operator', className: 'btn-op' },
  { id: 'multiply', value: '×', type: 'operator', className: 'btn-op' },
  { id: 'seven', value: '7', type: 'number', className: '' },
  { id: 'eight', value: '8', type: 'number', className: '' },
  { id: 'nine', value: '9', type: 'number', className: '' },
  { id: 'subtract', value: '-', type: 'operator', className: 'btn-op' },
  { id: 'four', value: '4', type: 'number', className: '' },
  { id: 'five', value: '5', type: 'number', className: '' },
  { id: 'six', value: '6', type: 'number', className: '' },
  { id: 'add', value: '+', type: 'operator', className: 'btn-op' },
  { id: 'one', value: '1', type: 'number', className: '' },
  { id: 'two', value: '2', type: 'number', className: '' },
  { id: 'three', value: '3', type: 'number', className: '' },
  { id: 'equals', value: '=', type: 'equal', className: 'btn-eq' },
  { id: 'zero', value: '0', type: 'number', className: 'btn-zero' },
  { id: 'decimal', value: '.', type: 'decimal', className: '' },
];

function isOperator(val) {
  return ['+', '-', '×', '/'].includes(val);
}

function Calculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [evaluated, setEvaluated] = useState(false);

  const handleClick = (value, type) => {
    if (type === 'number') {
      if (evaluated) {
        setDisplay(value);
        setExpression(value === '0' ? '' : value);
        setEvaluated(false);
      } else {
        if (display === '0' && value === '0') return;
        if (display === '0' && value !== '0') {
          setDisplay(value);
          setExpression(expression.replace(/([\d.]+)$/g, '') + value);
        } else {
          if (/([^\.\d]|^)0{2,}/.test(expression + value)) return;
          setDisplay(display + value);
          setExpression(expression + value);
        }
      }
    } else if (type === 'decimal') {
      if (evaluated) {
        setDisplay('0.');
        setExpression('0.');
        setEvaluated(false);
        return;
      }
      const lastNum = display.split(/\+|-|×|\//).pop();
      if (lastNum.includes('.')) return;
      setDisplay(display + '.');
      setExpression(expression === '' ? '0.' : expression + '.');
    } else if (type === 'operator') {
      let op = value === '×' ? '*' : value;
      if (evaluated) {
        setExpression(display + op);
        setDisplay(value);
        setEvaluated(false);
      } else {
        let newExp = expression;
        if (/([+\-*/])$/.test(expression)) {
          if (op === '-') {
            newExp = expression + op;
          } else {
            newExp = expression.replace(/([+\-*/])+$/, op);
          }
        } else {
          newExp = expression + op;
        }
        setExpression(newExp);
        setDisplay(value);
      }
    } else if (type === 'equal') {
      let exp = expression;
      while (/([+\-*/])$/.test(exp)) {
        exp = exp.slice(0, -1);
      }
      exp = exp.replace(/×/g, '*');
      try {
        let result = Function('return ' + exp)();
        result = Math.round((result + Number.EPSILON) * 10000) / 10000;
        setDisplay(result.toString());
        setExpression('');
        setEvaluated(true);
      } catch {
        setDisplay('Error');
        setExpression('');
        setEvaluated(true);
      }
    } else if (type === 'action') {
      setDisplay('0');
      setExpression('');
      setEvaluated(false);
    }
  };

  return (
    <div className="calc-container">
      <div id="display" className="calc-display">{display}</div>
      <div className="calc-buttons">
        {buttonConfig.map(({ id, value, type, className }) => (
          <button
            key={id}
            id={id}
            className={`calc-btn ${className}`}
            onClick={() => handleClick(value, type)}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Calculator; 