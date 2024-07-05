const fetchData = require('@nux-monorepo/api').fetchData;
const _ = require('loadsh');
console.log(fetchData(1, 2), 'core->package');
console.log(_.sample([1, 2, 3, 4]), 'core->package');