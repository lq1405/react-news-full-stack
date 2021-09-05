import React, { useState } from 'react';
import { Layout, Avatar, Dropdown, Menu } from 'antd';
import { withRouter } from 'react-router-dom';
const { Header } = Layout;


function TopHeader(props) {

    const [userMessage] = useState(JSON.parse(localStorage.getItem('token')))
    let menu = (
        <Menu>
            <Menu.Item key="1">{userMessage.role.roleName}</Menu.Item>
            <Menu.Item key="2" danger onClick={() => {
                localStorage.removeItem('token');
                props.history.replace('/login')
            }}>退出</Menu.Item>
        </Menu>
    )
    return (
        <Header className='header'>
            <div className='logo'>1111</div>
            <div style={{ float: 'right', fontSize: '15px' }}>
                <span style={{ marginRight: '10px' }}>欢迎 <span style={{ color: 'red' }}>{userMessage.username}</span> 回来</span>

                <Dropdown overlay={menu} placement="bottomRight">
                    <Avatar size={40}>U</Avatar>
                </Dropdown>
            </div>
        </Header>


    );
}

export default withRouter(TopHeader);