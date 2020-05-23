import React from 'react';
import Common                 from "./../common";
import {Avatar, List, Select} from 'antd';
const {Option} = Select;

class GetTemplateList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            children: [],
            containerName: "",
            itemData: [],
        }
    }

    componentDidMount() {
        const childrens = [];
        let _this = this;
        fetch(global.base.url + "/OCR/getTemplatesConfigurationInformation/" + _this.props.container, {method: 'GET'}).then(
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
                                containerName: _this.props.container,
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

    // 选择模板
    handleChange = (v) => {
        console.log(`selected ${v}`);
        // console.log(`selected ${JSON.stringify(v)}`);
        // this.props.handleTemplateChange(v);
    }

    render() {
        return (
            <List className="listDiv"
                itemLayout="horizontal"
                dataSource={this.state.itemData}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src=""/>}
                            title={item.title}
                            description={item.description}
                            onClick={() => {this.props.handleTemplateChange(item.title);}}
                        />
                    </List.Item>
                )}
            />
        )
    }
}

export default GetTemplateList;
