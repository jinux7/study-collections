let fs = require('fs');

let html_v = fs.readFileSync(__dirname+'/public/index.html').toString();
let replace_str_v = html_v.match(/<meta version=.*>/)&&html_v.match(/<meta version=.*>/)[0];
html_v = html_v.replace(replace_str_v,'');
let index_v = html_v.indexOf('<head>') + 6; 
let version_v = '\n\t<meta version=1.0.0 >';
let str1_v = html_v.substring(0,index_v),
	str2_v = html_v.substring(index_v);
let newString_v =  str1_v + version_v + str2_v;
fs.writeFileSync(__dirname+'/public/index.html',newString_v);