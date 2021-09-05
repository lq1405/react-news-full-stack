import { Button, Form, Input, message, Tabs } from 'antd';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom'
import {
    UserOutlined, EyeFilled,
    EyeInvisibleFilled, LockOutlined,
} from '@ant-design/icons'
import axios from 'axios';
import './login.scss'

const { TabPane } = Tabs;

function Login(props) {
    message.config({ maxCount: 1 });
    const [loginType, setLoginType] = useState('username');
    const [inputType, setInputType] = useState('password')
    const [showPassword, setShowPassword] = useState(false)
    const [form] = Form.useForm();

    function submitData() {
        form.validateFields().then(res => {
            console.log(res)
            axios.get(`http://localhost:8000/users?username=${res.username}&password=${res.password}&_expand=role`)
                .then(data => {
                    console.log(data.data);
                    if (data.data.length === 0) {
                        return message.error({ content: "用户名与密码不匹配" });
                    }
                    if (data.data[0].userState === 'action') {
                        localStorage.setItem('token', JSON.stringify(data.data[0]));
                        props.history.push('/home');
                    } else if (data.data[0].userState === 'warn') {
                        message.warning('您的账号被警告，请规范上网行为！')
                        setTimeout(() => {
                            localStorage.setItem('token', JSON.stringify(data.data[0]));
                            props.history.push('/home');
                        }, 2000);
                    } else {
                        message.error("您的账号不能登陆！")
                    }
                })
        })
    }
    return (
        <div className='login-out-box'>
            <div className='form-container'>
                <h1>Login</h1>
                <Tabs activeKey={loginType} type='card' onChange={(activeKey) => setLoginType(activeKey)}>
                    <TabPane key='username' tab="账号密码登陆" ></TabPane>
                    <TabPane key="2" tab="快捷登陆"></TabPane>
                </Tabs>
                {loginType === 'username' && (
                    <Form form={form}>
                        <Form.Item name="username"
                            validateTrigger='onBlur'
                            rules={[{ required: true, message: "请输入账号名" }]}
                        >
                            <Input placeholder="Username"
                                className='form-in-input'
                                prefix={<UserOutlined />} bordered={false}
                            ></Input>
                        </Form.Item>
                        <Form.Item name='password'
                            validateTrigger='onBlur'
                            rules={[{ required: true, message: '请输入密码' },
                            { max: 16, min: 8, message: '密码为8-16位的字符' }]}>
                            <Input placeholder="Password"
                                type={inputType}
                                className='form-in-input'
                                prefix={<LockOutlined />} bordered={false}
                                suffix={<div onClick={() => {
                                    setShowPassword(!showPassword);
                                    if (showPassword) {
                                        setInputType('text');
                                    } else {
                                        setInputType('password')
                                    }
                                }}>{showPassword ? <EyeFilled style={{ fontSize: '25px', color: '#888' }} /> :
                                    <EyeInvisibleFilled style={{ fontSize: '25px', color: '#888' }} />}</div>}
                            ></Input>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button"
                                onClick={() => { submitData(); }}
                            >
                                Log in
                            </Button>
                            <a style={{ marginLeft: '10%' }} href="#">注册</a>
                            <a className="login-form-forgot" href="#">忘记密码 </a>
                        </Form.Item>
                    </Form>
                )}
                {loginType === '2' && (
                    <h1>22222222222</h1>
                )}
            </div>
        </div>
    );
}

export default withRouter(Login);
