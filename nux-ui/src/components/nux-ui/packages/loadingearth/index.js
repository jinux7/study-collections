const install = function (Vue) {
  Vue.prototype.$showLoadingEarth = function (text) {
		nDiv.style.display = 'block'
  }
	Vue.prototype.$hideLoadingEarth = function (text) {
  	nDiv.style.display = 'none'
	}
	var templateStr = `<div class="nux-loading-inner">
                      <span class="dong"></span>
                      <span class="cont">加载中…</span>
                    </div>`
	var cssStr = `#nux-loading-earth {
									display: none;
									position: fixed;
									width: 100%;
									height: 100%;
									top: 0;
									left: 0;
									background-color: rgba(0,0,0,.6);
									z-index: 999;
								}
								#nux-loading-earth .nux-loading-inner {
									width: 60px;
									height: 60px;

									position: absolute;
									top: 50%;
									left: 50%;
									transform: translate(-50%,-50%);
									display: flex;
									justify-content: center;
									align-items: center;
									flex-direction: column;
								}
								#nux-loading-earth .nux-loading-inner::after {
									content: "";
									background-color: #ddd;
									opacity: 0.7;
									top: 0;
									left: 0;
									bottom: 0;
									right: 0;
									position: absolute;
									z-index: -1;
									border-radius: 7px;
								}
								#nux-loading-earth .nux-loading-inner .dong {

									width: 30px;
									height: 30px;
									background-size: cover;
									background-image: url('data:image/png;base64,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');

								}
								#nux-loading-earth .dong{
									animation:run 3s steps(1, start) infinite;
									-webkit-animation:run 3s steps(1, start) infinite;
									animation-fill-mode : backwards;
								}
								.nux-loading-inner .cont{
									color: #717171
								}
								@keyframes run {
									0% {
										background-position: 0 0;
									}
									2.7777777778% {
										background-position: -30px 0;
									}
									5.5555555556% {
										background-position: -60px 0;
									}
									8.3333333333% {
										background-position: -90px 0;
									}
									11.1111111111% {
										background-position: -120px 0;
									}
									13.8888888889% {
										background-position: -150px 0;
									}
									16.6666666667% {
										background-position: -180px 0;
									}
									19.4444444444% {
										background-position: -210px 0;
									}
									22.2222222222% {
										background-position: -240px 0;
									}
									25% {
										background-position: -270px 0;
									}
									27.7777777778% {
										background-position: -300px 0;
									}
									30.5555555556% {
										background-position: -330px 0;
									}
									33.3333333333% {
										background-position: -360px 0;
									}
									36.1111111111% {
										background-position: -390px 0;
									}
									38.8888888889% {
										background-position: -420px 0;
									}
									41.6666666667% {
										background-position: -450px 0;
									}
									44.4444444444% {
										background-position: -480px 0;
									}
									47.2222222222% {
										background-position: -510px 0;
									}
									50% {
										background-position: -540px 0;
									}
									52.7777777778% {
										background-position: -570px 0;
									}
									55.5555555556% {
										background-position: -600px 0;
									}
									58.3333333333% {
										background-position: -630px 0;
									}
									61.1111111111% {
										background-position: -660px 0;
									}
									63.8888888889% {
										background-position: -690px 0;
									}
									66.6666666667% {
										background-position: -720px 0;
									}
									69.4444444444% {
										background-position: -750px 0;
									}
									72.2222222222% {
										background-position: -780px 0;
									}
									75% {
										background-position: -810px 0;
									}
									77.7777777778% {
										background-position: -840px 0;
									}
									80.5555555556% {
										background-position: -870px 0;
									}
									83.3333333333% {
										background-position: -900px 0;
									}
									86.1111111111% {
										background-position: -930px 0;
									}
									88.8888888889% {
										background-position: -960px 0;
									}
									91.6666666667% {
										background-position: -990px 0;
									}
									94.4444444444% {
										background-position: -1020px 0;
									}
									97.2222222222% {
										background-position: -1050px 0;
									}
									100% {
										background-position: -1080px 0;
									}
								}
								`
	// 创建div和style节点
	var nDiv = document.createElement('div')
	var nStyle = document.createElement('style')
	// 给div和style添加模板内容
	nDiv.setAttribute('id', 'nux-loading-earth')
	nDiv.innerHTML = templateStr
	nStyle.setAttribute('type', 'text/css')
	nStyle.innerHTML = cssStr
	// 获取head， body节点元素
	var nBody = document.body
	var nHead = document.head
	// 添加这两个节点元素
	nHead.appendChild(nStyle)
	nBody.appendChild(nDiv)
}
export default { install }