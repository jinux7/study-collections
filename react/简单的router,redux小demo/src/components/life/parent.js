import React, { Component } from 'react'
import Son from './child'
class Parent extends Component {
  static defaultProps = {
      info:'parent info'
  }
  constructor(props){
    super();
    //初始化默认的状态对象
    this.state = {
      name:'parent life'
    };
    console.log('parent 1. constructor 初始化 props 和 state')

  }
  componentWillMount(){
    console.log(' parent2. componentWillMount 组件将要挂载')
  }
  //一般在componentDidMount执行副作用，如异步请求
  componentDidMount() {
    console.log('parent 4. componentDidMount 组件挂载完成')
    // this.fetch() //异步请求
    setTimeout(()=> {
      this.setState({
        name: 'change name'
      });
    }, 10000);
  }
  shouldComponentUpdate(nextProps,nextState){
    console.log('parent 5. shouldComponentUpdate 询问组件是否需要更新, 返回true则更新，否则不更新')
    return true;
  }
  componentWillUpdate(nextProps, nextState){
    console.log('parent 6. componentWillUpdate 组件将要更新')
  }
  componentDidUpdate(prevProps, prevState){
    console.log('parent 7. componentDidUpdate 组件更新完毕')
  }
  changeName = ()=>{
      this.setState({number:this.state.number})
  }
  render() {
    console.log('parent 3.render渲染')
    return (
      <div>
        <p>{this.props.info}:{this.state.name}</p>
        <button onClick={this.changeName}>更改name</button>
        <Son parentName={this.state.name} />
      </div>
    )
  }
}
export default Parent