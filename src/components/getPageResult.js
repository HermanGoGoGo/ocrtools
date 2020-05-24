import React                                                                           from 'react';
import {Layout, Menu, Breadcrumb, Select, List, Avatar, Upload, message, Button, Spin} from 'antd';
import {
    UserOutlined, LaptopOutlined, NotificationOutlined, UploadOutlined, LoadingOutlined, PlusOutlined,
}                                                                                      from '@ant-design/icons';
import $                                                                         from 'jquery'

// import './../App.css';

const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;
const {Option} = Select;
const colors = ["#FF9900","#99CCCC","#99CC33","#FFCC00","#33CC33","#CCCCFF","#CC6600","#999999","#CC9933","#99CC99","#669933","#663300","#993399","#6666CC","#333366","#99CC33","#CCCCCC","#000000","#CC6600","#336699","#666600","#CCCC66","#99CC33","#336699","#666666","#99CC33","#003366","#003333","#99CC33","#999999","#996633","#99CC66","#CCCC33","#FFCC99","#CCCC00","#999966","#336699","#999999","#00CC00","#0066CC"];
class PageReault extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: [], predictions: null, analyzeResult: {}, loading: false,
        }
    }

    componentDidMount() {
        let _this = this;
        this.setState({
            loading: true,
        })
        fetch(global.base.url + "/OCR/getTemplateInformation/" + this.props.template + "?containerName=" + this.props.container, {
            method: 'GET',
        }).then(function (res) {
            console.log(res);
            res.json().then(function (data) {
                console.log(JSON.stringify(data));
                // for (let i = 0; i < data.data.length; i++) {
                //     childrens.push(<Option key={data.data[i].name}>{data.data[i].name}</Option>);
                // }
                // console.log(childrens);

                if(data.data && data.data.modelInfos && data.data.modelInfos.length > 0){
                    let modelInfos = data.data.modelInfos[0];
                    console.log("modelInfos=",JSON.stringify(modelInfos));
                    if(modelInfos.modelInfo && modelInfos.modelInfo.status && modelInfos.modelInfo.status === 2){
                        if(modelInfos.keys && modelInfos.keys.clusters && modelInfos.keys.clusters["0"]){
                            _this.setState({
                                tags: modelInfos.keys.clusters["0"]
                            })
                        }
                        if(modelInfos.trainResult && modelInfos.trainResult.fields && modelInfos.trainResult.fields.length > 0){
                            let fields = modelInfos.trainResult.fields;
                            let tagsTemp = [];
                            for (let i = 0; i < fields.length; i++){
                                tagsTemp.push(fields[i].fieldName);
                            }
                            _this.setState({
                                tags: tagsTemp
                            })
                        }
                        // console.log("modelInfos.keys.clusters===",JSON.stringify(modelInfos.keys.clusters["0"]));
                        //
                    }
                }
                _this.setState({
                    loading: false,
                })
            })
        });
    }

    componentDidUpdate(prevProps, prevState){
        console.log("prevState.flag=",prevState.flag);
        console.log("this.state.flag=",this.state.flag);
        if ( prevState.flag !== this.state.flag ){
            // this.setState({
            //     loading: false,
            // })
        }
    }

    render() {
        const { tags, predictions } = this.state;
        // const tagsDisplayOrder = tags.map((tag) => tag.name);
        // for (const name of Object.keys(predictions)) {
        //     const prediction = predictions[name];
        //     if (prediction != null) {
        //         prediction.fieldName = name;
        //         prediction.displayOrder = tagsDisplayOrder.indexOf(name);
        //     }
        // }
        // // not sure if we decide to filter item by the page
        // const items = Object.values(predictions).filter(Boolean).sort((p1, p2) => p1.displayOrder - p2.displayOrder);


        return (<div>
                <Spin spinning={this.state.loading}>
                    <div className="container-items-center container-space-between results-container">
                        <h2 className="results-header">Results</h2>
                    </div>
                    <div className="prediction-field-header">
                        <h6 className="prediction-field-header-field"> Page # / Field name / Value</h6>
                        <h6 className="prediction-field-header-confidence"> Confidence %</h6>
                    </div>
                    <div className="prediction-header-clear"></div>

                    {this.state.tags.map((items, key) => this.renderAnalyzeResult(items, key))}
                    {/*{this.state.analyzeResult.map((item, key) => this.renderAnalyzeResult(item, key))}*/}
                </Spin>
            </div>);
    }

    getPostProcessedValue = (prediction) => {
        let keyValuePairs = this.props.keyValuePairs;
        for (let i = 0; i < keyValuePairs.length; i++) {
            if(keyValuePairs[i].key.text === prediction){
                console.log(prediction, "  ==  ", keyValuePairs[i].value.text);
                return keyValuePairs[i].value.text;
            }
        }
        return null;
    }

    renderAnalyzeResult = (item, key) => {
        const postProcessedValue = this.getPostProcessedValue(item);
        const style = {
            marginLeft: "0px", marginRight: "0px", background: this.getTagColor(postProcessedValue,key), color:postProcessedValue?"#fff":"#666"
        };
        return (<div key={key}
                // onClick={() => this.onPredictionClick(item)}
                // onMouseEnter={() => this.onPredictionMouseEnter(item)}
                // onMouseLeave={() => this.onPredictionMouseLeave(item)}
            >
                <li className="predictiontag-item" style={style}>
                    <div className={"predictiontag-color"}>
                        <span>{key + 1}</span>
                    </div>
                    <div className={postProcessedValue ? "predictiontag-content" : "predictiontag-content-null"}>
                        {this.getPredictionTagContent(item)}
                    </div>
                </li>
                {/*<li className={postProcessedValue ? "predictiontag-item-label mt-0" : "predictiontag-item-label mt-0 mb-1"}>*/}
                {/*    {postProcessedValue ? "text: " + item.text : item.text}*/}
                {/*</li>*/}
                {<li className={postProcessedValue ? "predictiontag-item-label mb-1" : "predictiontag-item-label mb-3"}>
                    {postProcessedValue}
                </li>}
            </div>);
    }

    getTagColor = (postProcessedValue, ind) => {
        // const tag = this.props.tags.find((tag) => tag.name.toLocaleLowerCase() === name.toLocaleLowerCase());
        // if(tag) {
        //     return tag.color;
        // }
        let len = colors.length;
        // console.log("ind = ", ind, " / ", this.state.tags.length, "  __  loading = ", this.state.loading);
        return postProcessedValue ? colors[ind < len ? ind : len - ind] : "#EEEEEE";
    }

    getPredictionTagContent = (item) => {
        return (<div className={"predictiontag-name-container"}>
                <div className="predictiontag-name-body">
                    {<span title={item} className="predictiontag-name-text px-2">
                            {item}
                        </span>}
                </div>
                <div className={"predictiontag-confidence"}>
                    <span>{this.toPercentage(item)}</span>
                </div>
            </div>);
    }

    toPercentage = (x) => {
        return typeof(x) === "number" ? (100 * x).toFixed(1) + "%" : "";
    }
}

export default PageReault;
