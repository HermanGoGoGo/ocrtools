import React from 'react';
import Common                                from "./../common";
import {Avatar, List, Select, message, Spin} from 'antd';
import $ from 'jquery'
const {Option} = Select;
class GetTemplateList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            children: [],
            containerName: "",
            loading: false,
            itemData: [],
        }
    }

    componentDidMount() {
        this.setState({loading: true});
        let _this = this;
        fetch(global.base.url + "/OCR/getTemplatesConfigurationInformation/" + _this.props.container, {method: 'GET'}).then(function (res) {
            //console.log(res);
            res.json().then(function (data) {
                //console.log('this.state.containerName=',_this.state.containerName);
                console.log(data);
                let itemDataArr = []
                let templateName = "";
                for (let i = 0; i < data.data.templateInfos.length; i++) {
                    // if(i === 0) {
                    //     templateName = data.data.templateInfos[i].templateName;
                    // }
                    itemDataArr.push({
                        title: data.data.templateInfos[i].templateName,
                        description: data.data.templateInfos[i].description,
                    });
                }

                console.log(itemDataArr);
                _this.setState({
                    itemData: itemDataArr, containerName: _this.props.container, templateName: templateName,
                });
                //$(".listDiv .ant-list-item").removeClass("listActive");
                if(templateName !== "") {
                    //_this.handleUploadFileOption(templateName,v);
                }
                _this.setState({loading: false});
            })
        });

    }

    // 选择模板
    handleChange = (v) => {
        console.log(`selected ${v}`);
        // console.log(`selected ${JSON.stringify(v)}`);
        // this.props.handleTemplateChange(v);
    }

    render() {
        return (<Spin spinning={this.state.loading}>
                <List className="listDiv"
                      itemLayout="horizontal"
                      dataSource={this.state.itemData}
                      renderItem={(item, key) => (<List.Item
                              className={this.props.container + "_" + key}
                          >
                              <List.Item.Meta
                                  avatar={<Avatar src=""/>}
                                  title={item.title}
                                  description={item.description}
                                  onClick={() => {
                                      $(".listDiv li").removeClass("listActive");
                                      this.props.handleTemplateChange(item.title);
                                      $("." + this.props.container + "_" + key).addClass("listActive");
                                  }}
                              />
                          </List.Item>)}
                />
            </Spin>)
    }
}

export default GetTemplateList;
