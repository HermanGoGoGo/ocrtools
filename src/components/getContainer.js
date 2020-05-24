import React from 'react';
import "./../common.js";
import {Select, Spin} from 'antd';
const {Option} = Select;

class GetContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            children: [],
            containerName: "",
            loading: false
        }
    }

    componentDidMount() {
        // this.setState({
        //     loading: true
        // })
        const childrens = [];
        let _this = this;
        console.log("start", global.base.url);
        fetch(global.base.url + "/container/getBlobContainers", {method: 'GET'}).then(function (res) {
            console.log(res);
            res.json().then(function (data) {
                console.log("data=",data);
                for (let i = 0; i < data.data.length; i++) {
                    childrens.push(<Option key={data.data[i].name}>{data.data[i].name}</Option>);
                }
                console.log(childrens);
                _this.setState({
                    children: childrens,
                })
                _this.props.handleContainerChange("");
            })
            .then(function (err) {
                console.log(err);
            })
        });
    }

    // 选择容器
    handleChange = (v) => {
        console.log(`selected ${v}`);
        this.props.handleContainerChange(v);
    }

    render() {
        return (
            // <Spin spinning={this.state.loading}>
                <Select
                    style={{width: 185}}
                    placeholder="请选择容器"
                    onChange={this.handleChange}
                >
                    {this.state.children}
                </Select>
            // </Spin>
        )
    }
}

export default GetContainer;
