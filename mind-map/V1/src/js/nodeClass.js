export default class Node {
  constructor(opts) {
    this.type = opts.type;
    this.parent = opts.parent;  
    this.text = opts.text,
    this.children = opts.children || [],
    this.layer = opts.layer;
    this.x = opts.x || 0;
    this.y = opts.y || 0;
    this.width = opts.width;
    this.height = opts.height;
  }
  xVal(val) {
    if(typeof val === 'undefined') {
      return this.x;
    }else {
      this.x = val;
    }
  }
  yVal(val) {
    if(typeof val === 'undefined') {
      return this.y;
    }else {
      this.y = val;
    }
  }
}