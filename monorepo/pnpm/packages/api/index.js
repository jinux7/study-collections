const sumFn = require('@nux-monorepo/utils').sumFn;
module.exports = {
  fetchData: (a, b)=> {
    let result = sumFn(a, b);
    console.log(result, 'api->pacakge');
    return result;
  }
}