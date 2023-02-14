import React, { Component } from 'react'
import { connect } from 'react-redux'
import './home.less'
import Header from '../../components/header/index'
import Parent from '../../components/life/parent'
import Fccom from '../../components/fccom/index'
class Home extends Component {
    render() {
        return (
            <div className="P-home">
              <Fccom dispatch="dispatch method" goodsList={ [1,2,3] } />
              {/* <Parent /> */}
              <Header />
              <h1>Home page</h1>
              <div>home page：{ this.props.count }</div>
            </div>
        )
    }
}

export default connect(
    (state)=> ({
      count: state.counter.number
    })
  )(Home)