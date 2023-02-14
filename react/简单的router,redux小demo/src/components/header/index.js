import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../store/actions/counter'
import './header.less'

class Header extends Component {
  onIncrease() {
    console.log(this.props);
    this.props.increment();
  }
  onDecrease() {
    this.props.decrement();
  }
  render() {
    return (
      <div className="M-header">
        <p>store中的值：{ this.props.count }</p>
        <button onClick={this.onIncrease.bind(this)}>+</button>
        <button onClick={this.onDecrease.bind(this)}>-</button>
      </div>
    )
  }
}

export default connect(
  (state)=> ({
    count: state.counter.number
  }),
  actions
)(Header)