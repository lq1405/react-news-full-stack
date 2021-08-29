//引入图标
import { HomeOutlined, MenuFoldOutlined, SolutionOutlined, UsergroupAddOutlined,MenuUnfoldOutlined } from '@ant-design/icons';
import React, {useState} from 'react';
import { Layout, Menu } from 'antd';
import { withRouter } from 'react-router-dom'

const { Sider } = Layout;
const { SubMenu, Item } = Menu;

//模拟创建菜单的数据
const menuList = [
    {
        key: "/home",
        icon: <HomeOutlined />,
        title: "首页",
    },
    {
        key: "/user-manager",
        icon: <UsergroupAddOutlined />,
        title: "用户管理",
        children: [
            {
                key: "/user-manager/list/1",
                title: "用户列表",
            }
        ]
    },
    {
        key: "/permit-manager",
        icon: <SolutionOutlined />,
        title: "权限管理",
        children: [
            {
                key: "/permit-manager/user-list/1",
                title: "用户权限",
            },
            {
                key: "/permit-manager/permit-type-list",
                title: "权限列表",
            }
        ]
    }
]


/**
 * 动态的创建菜单和子菜单的方法
 * @menuList    由菜单和子菜单组成的数据
 * @props       组件传递的路由数据
 * 返回的是菜单的jsx
 * **/
const renderMenu = (menuList, props) => {
    return menuList.map(item => {
        if (item.children) {
            return <SubMenu key={item.key} icon={item.icon} title={item.title}>
                {renderMenu(item.children, props)}
            </SubMenu>
        }
        return <Item key={item.key} icon={item.icon}
            onClick={() => {
                props.history.push(item.key)
            }}
        >{item.title}</Item>
    })
}


function SideMenu(props) {

    let [collapsed, setCollapsed]=useState(false);

    
    //该变量是菜单的底部的控制菜单的收缩的图标
    const shrinkIcon=(
        <div className='menu-footer-shrink' onClick={()=>setCollapsed(!collapsed)}>
            {
                collapsed?
                <MenuUnfoldOutlined />:
                <MenuFoldOutlined />
            }
        </div>
        )  

        
    //组件内的props是没有值的，要使用withRouter高阶组件，渲染SideMenu后props才是有值的
    return (
        <Sider trigger={shrinkIcon} collapsedWidth="60px" collapsed={ collapsed } collapsible className='layout-sider'>
            <Menu
                mode="inline"
                defaultOpenKeys={['sub1']}
                defaultSelectedKeys={['1']}
                style={{ height: '100%' }}
            >
                {/* 下面的方式是动态渲染菜单页面的 */}
                {renderMenu(menuList, props)}


            </Menu>

        </Sider>
    );
}

// 使用withRouter使得SideMenu的props不为null
export default withRouter(SideMenu);