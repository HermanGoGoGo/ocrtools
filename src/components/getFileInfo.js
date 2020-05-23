import React from 'react';
import logo  from './logo.svg';
import './App.css';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

import {Layout, Menu, Breadcrumb, Select, List, Avatar, Upload, message, Button} from 'antd';

import Common          from "./common";
// import GetContainer    from "./components/getContainer";
// import GetTemplateList from "./components/getTemplateList";
import PageReault      from "./components/getPageResult";
import { UserOutlined, LaptopOutlined, NotificationOutlined, UploadOutlined, LoadingOutlined, PlusOutlined,} from '@ant-design/icons';
import $ from 'jquery';

const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;
const {Option} = Select;

// const style = {
//     marginLeft: "0px",
//     marginRight: "0px",
//     // background: this.getTagColor(item.fieldName),
// };
const postProcessedValue = true;
const Commons = {
    baseUrl: "https://amwaytdkeaocrapi.azurewebsites.net/api",
    containerName: "",
    templateName: "",
}
class App extends React.Component {
    constructor (props) {
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

    componentDidMount () {
        const childrens = [];
        let _this = this;
    }

    componentWillUnmount () {
        // clearInterval(timer)
    }

    // 初始化上传按钮
    handleUploadFileOption = (templateName, containerName) => {

    }

    // 处理 选择容器
    handleContainerChange = (cName) => {
        // this.setState(
        //     {
        //         containerName: v,
        //     },
        // )
        Commons.containerName = cName;
        console.log("Commons.containerName=",Commons.containerName);
    }

    // 点击左边模板
    handleClickTemplate = (e) => {
        $(".listDiv .ant-list-item").removeClass("listActive");
        let name = e.target.parentNode.parentNode.parentNode;
        $(name).addClass("listActive");
        console.log("click...", name);
        //e.target.value
        //$(this)
        console.log("this.state.containerName=", this.state.containerName);
        console.log("this.state.templateName=", this.state.templateName);
        let _this = this;
        // https://amwaytdkeaocrapi.azurewebsites.net/api/OCR/getTemplateInformation/default?containerName=deliverynote
        fetch(baseUrl + "OCR/getTemplateInformation/" + _this.state.templateName + "?containerName=" + _this.state.containerName, {
            method: 'GET'
        }).then(
            function (res) {
                console.log(res);
                res.json().then(function (data) {
                        console.log(JSON.stringify(data));
                        // for (let i = 0; i < data.data.length; i++) {
                        //     childrens.push(<Option key={data.data[i].name}>{data.data[i].name}</Option>);
                        // }
                        // console.log(childrens);
                        // _this.setState(
                        //     {
                        //         children: childrens
                        //     }
                        // )
                    }
                )
            });
        this.setState(
            {
                submitFileUrl: baseUrl + "OCR/analyzeTemplate/" + this.state.templateName + "?containerName=" + this.state.containerName + "&includeTextDetails=true",
            }
        );
        setTimeout(function () {
            _this.setState(
                {
                    showButton: true
                }
            );
        }, 200)
    }

    // 打开文件之后的操作
    handleUpladChange = info => {
        console.log("info===", info);
        if(info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if(info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                }),
            );
            console.log("info===", JSON.stringify(info));
            console.log("info_response===", JSON.stringify(info.fileList[0].response));
            if(info.fileList && info.fileList[0] && info.fileList[0].response && info.fileList[0].response.data){
                let resData = info.fileList[0].response.data;
            }
        }
    };

    render () {
        const {children, itemData, imageUrl, submitFileUrl, analyzeResult} = this.state;
        return (
            <Common.Provider value={Commons}>
                <Layout>
                    <Header className="header">

                        {this.state.showButton !== false && <Upload
                            name="files"
                            className="uploadBox"
                            showUploadList={false}
                            action={submitFileUrl}
                            onChange={this.handleUpladChange}>
                            {/*{this.state.loading ? <LoadingOutlined/> : <PlusOutlined/>}*/}
                            <Button>
                                <UploadOutlined/> 打开文件
                            </Button>
                        </Upload>}
                    </Header>
                    <Layout>
                        <Sider width={200} className="site-layout-background">
                            {/*https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png*/}
                            <List
                                className="listDiv"
                                itemLayout="horizontal"
                                dataSource={itemData}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<Avatar src=""/>}
                                            title={item.title}
                                            description={item.description}
                                            onClick={this.handleClickTemplate}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Sider>
                        <Layout style={{padding: '0'}}>

                            <Content
                                className="site-layout-background"
                                style={{
                                    padding: 24,
                                    margin: 0,
                                    minHeight: 280,
                                }}
                            >
                                {imageUrl && <img src={imageUrl} alt="avatar" style={{width: '100%'}}/>}
                                {/*    <object classID="clsid:CA8A9780-280D-11CF-A24D-444553540000" width="100%" height="100%" border="0">*/}
                                {/*        <param name="_Version" value="65539"/>*/}
                                {/*        <param name="_ExtentX" value="20108"/>*/}
                                {/*        <param name="_ExtentY" value="10866"/>*/}
                                {/*        <param name="_StockProps" value="0"/>*/}
                                {/*        <param name="SRC" value={this.state.pdf}/>*/}
                                {/*        <embed src={this.state.pdf} width="100%" height="800" href="testing_pdf.pdf"></embed>*/}
                                {/*    </object>*/}
                            </Content>
                        </Layout>
                        <Sider width={280} className="site-layout-background">
                            <PageReault>

                            </PageReault>
                        </Sider>
                    </Layout>
                </Layout>
            </Common.Provider>
        )
    }
}

function getBase64 (img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload (file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if(!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if(!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
}

export default App;
