// 四则运算字符串
const inputStr = '100+200-300';

// 匹配数字的正则
const NumReg = /[0-9]/
// 匹配标点符号的正则规则
const PunctuatorReg = /[\+\-\*\/]/

// 最终输出的所有tokens合集
const tokens = []

// 当前状态机中正在处理的token
let currentToken = {}

/**
 * 词法分析函数
 * @param {*} inputStr 
 * @returns tokens
 */
function stateMachine(inputStr) {
  // 定义状态机的初始状态判断函数
  let state = start
  // 依次迭代输入的字符串
  // while(inputStr) {
  //   state = state(inputStr[0]);
  //   inputStr = inputStr.slice(1);
  // }
  inputStr.split("").forEach(char => {
      // 此处的char是每一个字符
      // 调用state函数 并且传入char
      state = state(char)
  })
  // 遍历结束后仍然需要发送一次最后
  tokens.push(currentToken)
  return tokens;
}


/**
 * 状态机初始函数
 * @param {*} char 输入的字符
 * @return {*} 
 */
function start (char) {
  if(NumReg.test(char)) {
      // 首个输入的char是数字 初始化token为numeric
      currentToken = { type: 'Numeric', value: char }
      // 返回的是一个nunmer的处理函数
      return numeric
  }else if (PunctuatorReg.test(char)) {
      // 首个输入的char是标点符号 初始化current为punctuator
      currentToken = { type: 'Punctuator', value: char }
      // 返回的是一个punctuator的处理函数
      return punctuator
  }
}

// 数字处理函数
function numeric(char) {
  if(NumReg.test(char)) {
      // 如果当前输入是数字 不分词 连续累加value值
      currentToken.value += char
      // 返回numeric函数赋给state
      return numeric
  }else if (PunctuatorReg.test(char)) {
      // 如果是标点符号 分词
      // 如果当前输入的标点符号 进行分词
      // 首先将旧的token输入到tokens中
      emitToken(currentToken)
      // 修改当前token
      currentToken = { type: 'Punctuator', value: char }
      // 返回punctuator处理函数
      return punctuator
  }
}

// 标点符号状态处理函数
function punctuator(char) {
  // 无论如何都要发射 因为标点符号在分词阶段不会被拼接起来
  emitToken(currentToken)
  if (NumReg.test(char)) {
    currentToken = { type: 'Numeric', value: char }
    return numeric
  } else if (PunctuatorReg.test(char)) {
    currentToken = { type: 'Punctuator', value: char }
    return punctuator
  }

  return punctuator
}

// 将token放入tokens中
function emitToken(token) {
  // 重制 currentToken
  currentToken = { type: '', value: '' }
  // 将上一次传入的token参数保存到最终输入的tokens中
  tokens.push(token)
}

console.log(stateMachine(inputStr));