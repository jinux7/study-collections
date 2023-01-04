// 四则运算字符串
const inputStr = '100+200-300';
// 匹配数字的正则
const NumReg = /[0-9]/
// 匹配标点符号的正则规则
const PunctuatorReg = /[\+\-\*\/]/
// 最终输出的所有tokens合集
const tokens = []
// 当前状态机中正在处理的token
let currentToken = '';

let type = 'start';
function start(char, i, str) {
  if( type==='start'&&NumReg.test(char)) {
    type = 'Numberic';
    currentToken += char;
  }else if(type==='Numberic'&&NumReg.test(char)) {
    currentToken += char;
  }else if(type==='Numberic'&&PunctuatorReg.test(char)) {
    tokens.push({
      type: 'Numberic',
      value: currentToken
    });
    type = 'Punctuator';
    currentToken = char;
  }else if(type==='Punctuator'&&NumReg.test(char)) {
    type = 'Numberic';
    tokens.push({
      type: 'Punctuator',
      value: currentToken
    });
    currentToken = char;
  }
  if(type==='Numberic'&&i===(str.length-1)) {
    tokens.push({
      type: 'Numberic',
      value: currentToken
    });
    currentToken = '';
  }
}

function stateMachine(str) {
  for(let i=0; i<str.length; i++) {
    start(str[i], i, str);
  }
  return tokens;
}
console.log(stateMachine(inputStr));