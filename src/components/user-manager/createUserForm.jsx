import React from 'react';
import { Form, Input, Select } from 'antd';
const { Option } = Select;

const userState = ['action', 'cancel', 'warn']

const CreateUserForm = (props) => {
    return (
        <Form
            // initialValues={[]}
            form={props.form}
            labelCol={{ span: 5 }}
        >
            <Form.Item label="用户名" name="username"
                // initialValue={props.defaultUser.username}
                rules={[{ required: true, message: '该字段不能为空' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item label="密码" name="password"
                // initialValue={props.defaultUser.password}
                rules={[{ required: true, message: '该字段不能为空' },
                { max: 16, min: 8, message: '密码长度在8-16' }]}
            >
                <Input type="password" />
            </Form.Item>
            <Form.Item label="用户状态" name="userState"
                // initialValue={props.defaultUser.userState}
                rules={[{ required: true, message: '该字段不能为空' }]}
            >
                <Select>
                    {userState.map(item => {
                        return <Option key={item} value={item}>{item}</Option>
                    })}
                </Select>
            </Form.Item>
            <Form.Item label="角色权限" name="roleId"
                rules={[{ required: true, message: '该字段不能为空' }]}
            >
                <Select>
                    {props.permitUserList.map(item => {
                        return <Option key={item.id} value={item.id}>{item.roleName}</Option>
                    })}
                </Select>
            </Form.Item>

        </Form>
    )
}
export default CreateUserForm;