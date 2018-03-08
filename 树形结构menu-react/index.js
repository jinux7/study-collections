import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import './index.less';
import $ from 'jquery';

class SubMenuAtTree extends Component {
    constructor(props){
        super(props);
        this.state= {
            treeNodes: ''
        }
        this.treeDataArr = []; 
    }

    componentDidMount(){
        const dData = JSON.parse(localStorage.getItem('basedata'));
        this.treeDataArr.push(dData.orgTreeNode);
        console.log(this.treeDataArr,123);
        this.setState({
            treeNodes: this.renderTreeNodes(this.treeDataArr)
        });
        $('.treeArea').on('click','strong',(ev)=>{
            let node = ev.target;
            if(!$(node).data('isExpansion')){
                $(node).data('isExpansion',true).addClass('jia').removeClass('jian').parent().find('>.childrenArea').hide();

            }else {
                $(node).data('isExpansion',false).addClass('jian').removeClass('jia').parent().find('>.childrenArea').show();        
            }
        });
        $(window).keydown((ev)=>{
			if(ev.keyCode === 13) this.refreshMenu();
		});
    }
    refreshMenu = ()=>{
        let val = this.refs.inputStr.value;
        let queryArrDa = [],queryArrData_all = [];
        function queryStr(da,str){ //遍历treeData模糊查询得到匹配输入文字的节点对象
            for(let k in da){
                if(da[k].name.indexOf(str)>-1) queryArrDa.push(da[k]);
                queryStr(da[k].childrens,str);
            }
        }
        queryStr(this.treeDataArr,val);
        $('.treeArea .group,.treeArea .company,.treeArea .farm').hide();
        queryArrDa.forEach((item,index)=>{
            $('.treeArea .'+item.code).show().parentsUntil('.treeArea').show();
        });
    }
    toPage = (path,state)=>{
        this.props.history.push('/'+path,state);
    }
    renderTreeNodes = (data) => {
        return data.map((item,index) => {
          if (item.childrens) {
            if(item.level === '0'){
                return (
                    <span key={index}>
                        <Group name={item.name} code={item.code} toPage={this.toPage} >
                        {this.renderTreeNodes(item.childrens)}
                        </Group>
                    </span>
                    
                  );
            }else if(item.level === '1') {
                return (
                    <span key={index}>
                        <Company name={item.name} code={item.code} toPage={this.toPage} >
                        {this.renderTreeNodes(item.childrens)}
                        </Company>
                    </span>
                  );
            }else if(item.level === '2') {
                return (
                    <i key={index}>                    
                        <Farm name={item.name} hasImg={true} code={item.code} toPage={this.toPage} >
                        {this.renderTreeNodes(item.childrens)}
                        </Farm>
                    </i>
                  );
            }
            
          }
          return (
            <i key={index}>
                <Farm name={item.name} code={item.code} toPage={this.toPage} hasImg={false} />
            </i>
          );
        });
    }
    
    render(){
        return (
            <div id="subMenuAtTree">
                <div className="wrap">
                    <div className="searchArea">
                        <i></i>
                        <input type="text" ref="inputStr" placeholder="输入关键字"/>
                    </div>
                    <div className="treeArea">
                        { this.state.treeNodes }
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(SubMenuAtTree);
let indexKey = 1;
//集团
class Group extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className={`group ${this.props.code}`} >
                <strong className="jian"></strong>
                <span onClick={this.props.toPage.bind(this,'home',{})}>{this.props.name}集团</span>
                <div className="childrenArea" >
                    {this.props.children}
                </div>
            </div>
        );
    }
}
//公司
class Company extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className={`company ${this.props.code}`} >
                <strong className="jian"></strong>
                <span onClick={this.props.toPage.bind(this,'home',{companyCode:this.props.code})}>{this.props.name}</span>
                <div className="childrenArea">
                    {this.props.children}
                </div>
            </div>
        );
    }
}
//风场
class Farm extends Component {
    constructor(props){
        super(props);
    }
    
    render(){
        return (
            <div className={`farm ${this.props.code}`}>
                <strong className="jian" style={{visibility:this.props.hasImg?'visible':'hidden'}}></strong>
                <span onClick={this.props.toPage.bind(this,'everyMonentMonitor',{})}>{this.props.name}</span>
                <div className="childrenArea">
                    {this.props.children}
                </div>
            </div>
        );
    }
}