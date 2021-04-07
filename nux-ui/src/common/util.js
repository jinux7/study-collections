/**
 * @description 随机打乱数组
 * @param { Array } arr
 */
export function shuffleArr(arr) {
  for (var i = arr.length - 1; i >= 0; i--) {
    var randomIndex = Math.floor(Math.random() * (i + 1));
    var itemAtIndex = arr[randomIndex];
    arr[randomIndex] = arr[i];
    arr[i] = itemAtIndex;
  }
  return arr;
}

/**
 * @description 随机打乱json对象
 * @param { json } obj
 */
export function shuffleJson(obj) {
  let keyArr = Object.keys(obj);
  let shuffleKeyArr = shuffleArr(keyArr);
  let shuffleObj = {};
  shuffleKeyArr.forEach(item=> {
    shuffleObj[item] = obj[item];
  });
  return shuffleObj;
}