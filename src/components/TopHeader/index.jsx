import React from 'react';
import { Layout, Avatar, Dropdown, Menu } from 'antd';
const { Header } = Layout;


let menu = (
    <Menu>
        <Menu.Item key="1">权限查看</Menu.Item>
        <Menu.Item key="2" danger>退出</Menu.Item>
    </Menu>
)
function TopHeader(props) {
    return (
        <Header className='header'>
            <div className='logo'>1111</div>
            <div style={{ float: 'right', fontSize: '15px' }}>
                <span style={{ marginRight: '10px' }}>欢迎 <span style={{ color: 'red' }}>admin</span> 回来</span>

                <Dropdown overlay={menu} placement="bottomRight">
                    <Avatar size={40}>U</Avatar>
                </Dropdown>
            </div>
        </Header>


    );
}

export default TopHeader;