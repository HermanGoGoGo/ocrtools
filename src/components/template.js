import React                                                                     from 'react';
import logo                                                                      from './logo.svg';
import './App.css';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import {Layout, Menu, Breadcrumb, Select, List, Avatar, Upload, message, Button} from 'antd';
import {
    UserOutlined,
    LaptopOutlined,
    NotificationOutlined,
    UploadOutlined,
    LoadingOutlined,
    PlusOutlined,
}                                                                                from '@ant-design/icons';
import $                                                                         from 'jquery'

const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;
const {Option} = Select;

const baseUrl = "https://amwaytdkeaocrapi.azurewebsites.net/api/";
// const style = {
//     marginLeft: "0px",
//     marginRight: "0px",
//     // background: this.getTagColor(item.fieldName),
// };
const postProcessedValue = true;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            children: [],
            containerName: "",
            itemData: [],
            templateName: "",
            showButton: false,
            pdf: "",
            loading: false,
            submitFileUrl: "",
            analyzeResult: {},
            // tagItems
        }
        // this.handleChange  = this.handleChange.bind(this);
    }

    componentDidMount() {
        const childrens = [];
        let _this = this;
        fetch(baseUrl + "container/getBlobContainers", {method: 'GET'}).then(
            function (res) {
                console.log(res);
                res.json().then(function (data) {
                        console.log(data);
                        for (let i = 0; i < data.data.length; i++) {
                            childrens.push(<Option key={data.data[i].name}>{data.data[i].name}</Option>);
                        }
                        console.log(childrens);
                        _this.setState(
                            {
                                children: childrens,
                            },
                        )
                    },
                )
            });
        let cHeight = $(window).height();

    }

    componentWillUnmount() {
        // clearInterval(timer)
    }


    // 选择容器
    handleChange = (v) => {
        let _this = this;
        console.log(`selected ${v}`);
        // + containerName
        this.setState(
            {
                containerName: v,
            },
        )

        fetch(baseUrl + "OCR/getTemplatesConfigurationInformation/" + v, {method: 'GET'}).then(
            function (res) {
                //console.log(res);
                res.json().then(function (data) {
                        //console.log('this.state.containerName=',_this.state.containerName);
                        console.log(data);
                        let itemDataArr = []
                        let templateName = "";
                        for (let i = 0; i < data.data.templateInfos.length; i++) {
                            if(i === 0) {
                                templateName = data.data.templateInfos[i].templateName;
                            }
                            itemDataArr.push({
                                title: data.data.templateInfos[i].templateName,
                                description: data.data.templateInfos[i].description,
                            });
                        }

                        console.log(itemDataArr);
                        _this.setState(
                            {
                                itemData: itemDataArr,
                                containerName: v,
                                templateName: templateName,
                            },
                        );
                        //$(".listDiv .ant-list-item").removeClass("listActive");
                        if(templateName !== "") {
                            //_this.handleUploadFileOption(templateName,v);

                        }
                    },
                )
            });
    }

    render() {
        const {children} = this.state;
        return (
            <Select
                style={{width: 185}}
                placeholder="请选择容器"
                onChange={this.handleChange}
            >
                {children}
            </Select>
        )
    }
}

export default App;
