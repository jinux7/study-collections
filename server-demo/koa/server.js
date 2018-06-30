const Koa = require('koa');
const route = require('koa-route');
const app = new Koa();
const cors = require('koa2-cors'); // 解决跨域请求

app.use(cors());
const tenMinutesDataQuery = ctx => {
	const singleData = {'key1':'','key2':'16.07','key3':'20.36','key4':'','key5':'','key6':'','key7':'','key8':'','key9':'','key10':''};
    let dataLi = [], index =1;
    while(index < 2001){
        let obj = {};
        for(var key in singleData){
            if(key === 'key1') {
                obj[key] = new Date();
                continue ;
            }
            obj[key] = (Math.random()*100).toFixed(2);
        }
        dataLi.push(obj);
        index++;
    }
    var obj = {
        total: 2000,
        data: dataLi
    }

    ctx.response.body = obj;
}


app.use(route.get('/homeapi', tenMinutesDataQuery));
app.listen(3000);