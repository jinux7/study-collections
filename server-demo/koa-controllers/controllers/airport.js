// 机场运营平台首页
var getHomeOrderChart = async (ctx, next) => {
	console.log(ctx.request.body);
	 ctx.response.body = {
		 code: '0000',
		 msg: 'refunding'
	 };
}


module.exports = {
	'POST /getHomeOrderChart': getHomeOrderChart
};