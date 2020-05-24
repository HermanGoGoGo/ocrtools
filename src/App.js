import React from 'react';
import logo  from './logo.svg';
import './App.css';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

import {Layout, Menu, Breadcrumb, Select, List, Avatar, Upload, message, Button, Spin, Alert, Switch, Space  } from 'antd';

import "./common";

import { UserOutlined, LaptopOutlined, NotificationOutlined, UploadOutlined, LoadingOutlined, PlusOutlined,} from '@ant-design/icons';

import $               from 'jquery';
import pdfjsLib        from "pdfjs-dist";
import * as PDFJS from "pdfjs-dist";
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import GetContainer    from "./components/getContainer";
import GetTemplateList from "./components/getTemplateList";
import PageReault      from "./components/getPageResult";

const {Header, Content, Sider} = Layout;

class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            containerName: "",
            templateName: "",
            showButton: false,
            pdf: "",
            loading: false,
            centerLoading: false,
            submitFileUrl: "",
            fileUid:"",
            keyValuePairs: [],
            currPdf:null,
            // tagItems
        }
        // this.handleChange  = this.handleChange.bind(this);
    }

    // 处理 选择容器
    handleContainerChange = (cName) => {
        this.setState({
            containerName:cName,
            loading: false,
            templateName: "",
        })
    }

    componentDidMount() {
        this.setState({
            loading: true
        })
    }

    toggle = value => {
        this.setState({ loading: value });
    };

    // 处理 选择模板
    handleTemplateChange = (tName) => {
        console.log("tName=", tName);
        this.setState({
            templateName: tName,
            submitFileUrl: global.base.url + "/OCR/analyzeTemplate/" + tName + "?containerName=" + this.state.containerName + "&includeTextDetails=true",
        });

    }

    // 打开文件之后的操作
    handleUpladChange = info => {
        let _this = this;
        console.log("info===", info);
        if(info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if(info.file.status === 'error'){
            this.setState({centerLoading: false});
        }
        if(info.file.status === 'done') {
            // determine how to load file based on MIME type of the file
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
            switch (info.file.type) {
                case "image/jpeg":
                case "image/png":
                    // Get this url from response in real world.
                    getBase64(info.file.originFileObj, imageUrl =>
                        this.setState({
                            imageUrl,
                            loading: false,
                        })
                    );
                    break;
                case "application/pdf":
                    this.loadPdfFile(info.file.originFileObj);
                    console.log("info.file.originFileObj===", info.file.originFileObj);
                    // const imageUrl = this.createObjectURL(info.file);
                    // console.log("imageUrl===", imageUrl);
                    // this.setState({
                    //     imageUrl,
                    //     loading: false,
                    // });
                    break;
                default:
                    // un-supported file type
                    this.setState({
                        imageUri: "",
                        shouldShowAlert: true,
                        alertTitle: "Not supported file type",
                        alertMessage: "Sorry, we currently only support JPG/PNG/PDF files.",
                    });
                    break;
            }

            //console.log("info===", JSON.stringify(info));
            //console.log("info_response===", JSON.stringify(info.fileList[0].response));
            if(info.file.response && info.file.response.data){
                let resData = info.file.response.data;
                // console.log("resData===", JSON.stringify(resData));
                console.log("resData===", resData);
                if(resData.analyzeResult && resData.analyzeResult.pageResults && resData.analyzeResult.pageResults.length > 0){
                    let pageResults = resData.analyzeResult.pageResults[0];
                    console.log("pageResults===", pageResults);
                    if(pageResults.keyValuePairs){
                        this.setState({
                            fileUid: info.file.uid,
                            keyValuePairs: pageResults.keyValuePairs,
                        })
                        console.log("keyValuePairs===", JSON.stringify(pageResults.keyValuePairs));
                    }
                }
                this.setState({
                    centerLoading: false
                })
            }
        }
    };

    beforeUpload = (file) => {
        this.setState({
            centerLoading: true
        })
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf';//
        if(!isJpgOrPng) {
            // this.loadPdfFile(file);
            // console.log("======",URL.createObjectURL(file));
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if(!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    }

    createObjectURL = (object) => {
        // generate a URL for the object
        return (window.URL) ? window.URL.createObjectURL(object) : "";
    }

    loadPdfFile = (file) => {
        let self = this;
        // pdf.js无法直接打开本地文件,所以利用FileReader转换
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        $('#pdf-container canvas').remove();
        reader.onload = function (e) {
            const typedarray = new Uint8Array(this.result);
            const loadingTask = PDFJS.getDocument(typedarray);
            loadingTask.promise.then(function (pdf) {
                if (pdf) {
                    // pdf 总页数
                    const pageNum = pdf.numPages;
                    for (let i = 1; i <= pageNum; i++) {
                        // 生成每页 pdf 的 canvas
                        const canvas = document.createElement('canvas');
                        canvas.id = "pageNum" + i;
                        // 将 canvas 添加到 dom 中
                        $('#pdf-container').append(canvas);
                        const context = canvas.getContext('2d');
                        self.openPage(pdf, i, context);
                    }
                    setTimeout(() => {
                        self.exportImg(self)
                    }, 1000);
                }
            }).catch(function (reason) {
                console.error("Error: " + reason);
            });
        };
    }

    openPage(pdfFile, pageNumber, context) {
        var scale = 2;
        pdfFile.getPage(pageNumber).then(function (page) {
            // reference canvas via context
            const viewport = page.getViewport(scale);
            var canvas = context.canvas;
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            canvas.style.width = "100%";
            canvas.style.height = "100%";
            var renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            page.render(renderContext);
        });
        return;
    }

    exportImg(self) {
        // 将 canvas 导出成 img
        $('#pdf-container canvas').each(function (index, ele) {
            console.log("index===", index);
            var canvas = document.getElementById("pageNum" + (index + 1));
            // 将 canvas 转成 base64 格式的图片
            let base64ImgSrc = canvas.toDataURL("image/png")
            // const img = document.createElement("img")
            // img.setAttribute('class', 'pdf-img');
            // img.src = base64ImgSrc
            // img.style.width = '100%';
            // // 将图片挂载到 dom 中
            // $('#pdf-container').append(img);
        });
    }

    render () {
        const {containerName, templateName, imageUrl, submitFileUrl, fileUid, keyValuePairs} = this.state;
        return (
            // <Common.Provider value={Commons}>
                <Layout>
                    <Spin spinning={true}>
                    </Spin>
                    <Header className="header">
                        <Space>
                            <GetContainer handleContainerChange={this.handleContainerChange}></GetContainer>
                            {this.state.templateName !== false && <Upload
                                name="files"
                                className="uploadBox"
                                showUploadList={false}
                                action={submitFileUrl}
                                beforeUpload={this.beforeUpload}
                                onChange={this.handleUpladChange}>
                                {/*{this.state.loading ? <LoadingOutlined/> : <PlusOutlined/>}*/}
                                <Button>
                                    <UploadOutlined/> 打开文件
                                </Button>
                            </Upload>}
                        </Space>
                    </Header>
                    <Layout>
                        <Sider width={200} className="site-layout-background site-layout-left">
                            {this.state.containerName && <GetTemplateList key={this.state.containerName} container={this.state.containerName} handleTemplateChange={this.handleTemplateChange}></GetTemplateList>}
                        </Sider>
                        <Layout style={{padding: '0'}}>

                            <Content
                                className="site-layout-background"
                                style={{
                                    padding: 24, margin: 0, minHeight: 280,
                                }}
                            >

                                <Spin spinning={this.state.centerLoading}>
                                    {/*<Alert*/}
                                    {/*    message="操作指引："*/}
                                    {/*    description="<ul><li>1、选择容器</li><li>2、选择模板</li><li>3、打开要识别的文件</li></ul>"*/}
                                    {/*    type="info"*/}
                                    {/*/>*/}
                                    {imageUrl && <img src={imageUrl} alt="avatar" style={{width: '100%'}}/>}
                                    <div id="pdf-container"></div>
                                </Spin>
                            </Content>
                        </Layout>
                        <Sider width={280} className="site-layout-background site-layout-right">
                            {containerName && templateName &&
                            <PageReault
                                key={containerName + "_" + templateName + "_" + fileUid}
                                container={containerName}
                                template={templateName}
                                keyValuePairs={keyValuePairs}
                            ></PageReault>}
                        </Sider>
                    </Layout>
                </Layout>
            // </Common.Provider>

        )
    }
}

function getBase64 (img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

export default App;
