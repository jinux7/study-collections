var equals = require('shallow-equals')
 
// true: 
equals([1, 2, 3], [1, 2, 3])
 
// true: 
equals({ hello: 'world' }, { hello: 'world' })
 
// false: 
equals([1, 2, {}], [1, 2, {}])
 
// true: 
equals([1, 2], [
  { value: 1 },
  { value: 2 }
], function(a, b) {
  return a === b.value
})

let a = { hello: 'world' , list: [1,3]}
let b = { hello: 'world' , list: [1,3]}

console.log(JSON.stringify(a)===JSON.stringify(b));

console.log(equals({ hello: 'world' }, { hello: 'world' }));