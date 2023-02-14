// 子组件
import React, { Component } from 'react'
class Son extends Component {
  constructor(props) {
    super(props)
    this.state = {
      info: 'son info',
    }
    console.log('son constructor');
  }
  componentWillUnmount() {
    console.log('Son 组件将要挂载')
  }
  componentDidMount() {
    console.log('Son 组件完成挂载')
  }
  //调用此方法的时候会把新的属性对象和新的状态对象传过来
  shouldComponentUpdate(nextProps, nextState) {
    console.log('son 调用此方法的时候会把新的属性对象和新的状态对象传过来');
    // if (nextProps.parentName !== 'parent info') {
    //   return true
    // } else {
    //   return false
    // }
    return true;
  }
  componentWillUpdate(nextProps, nextState){
    console.log('son. componentWillUpdate 组件将要更新')
  }
  componentDidUpdate(prevProps, prevState){
    console.log('son. componentDidUpdate 组件更新完毕')
  }
  //componentWillReceiveProp 组件收到新的属性对象
  componentWillReceiveProps() {
    console.log('Son组件 componentWillReceiveProps')
  }
  render() {
    console.log('Son组件 render')
    return (
      <div>
        <p>{this.props.parentName}</p>
      </div>
    )
  }
}
export default Son