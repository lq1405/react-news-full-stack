import React from 'react'
import { Form, Input, Select } from 'antd'
import NewsEdit from './NewsEdit';

const { Option } = Select;

export default function NewsEditForm(props) {
    return (
        <div>
            <Form
                form={props.form}
                initialValues={{}}
                onValuesChange={(changedValues, allValues) => {
                    console.log(111111, changedValues, allValues);
                    props.getTitle(allValues.title);
                    props.getNewsType(allValues.newsType);
                    // setNewsType(allValues.newsType);
                    // setTitle(allValues.title);
                }}
                autoComplete="off" >
                <Form.Item
                    label="新闻标题"
                    name="title"
                    rules={[{ required: true, message: '请输入新闻的名称！' }]}

                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="新闻类型"
                    name="newsType"
                    rules={[{ required: true, message: '请选择新闻的类型！' }]}
                >
                    <Select>
                        {props.newsTypeList.map(item => <Option key={item.id} value={item.typeName}>{item.typeName}</Option>)}
                    </Select>
                </Form.Item>
            </Form>

            <div>
                <NewsEdit getContent={(value) => {
                    // console.log(value);
                    // setContent(value);
                    props.getContent(value);
                }} content={props.content}></NewsEdit>
            </div>
        </div>
    )
}
