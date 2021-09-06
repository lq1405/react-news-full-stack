//引入图标
import {
    HomeOutlined, MenuFoldOutlined,
    SolutionOutlined, UsergroupAddOutlined,
    MenuUnfoldOutlined, FileDoneOutlined,
    BarsOutlined, CloudUploadOutlined
} from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { withRouter } from 'react-router-dom'
import axios from "axios";

const { Sider } = Layout;
const { SubMenu } = Menu;

//定义图标：
const icons = {
    "/home": <HomeOutlined />,
    "/user-manager": <UsergroupAddOutlined />,
    "/permit-manager": <SolutionOutlined />,
    "/news-manager": <BarsOutlined />,
    "/examine-manager": <FileDoneOutlined />,
    "/release-manager": <CloudUploadOutlined />
}




function SideMenu(props) {

    let [collapsed, setCollapsed] = useState(false);
    let [menuList, setMenuList] = useState([]);
    const limits = JSON.parse(localStorage.getItem('token')).role.limits;
    const [arr] = useState([]);
    useEffect(() => {
        axios.get('/menus?_embed=children')
            .then((res) => {
                res.data.map(item => arr.push(item.key))
                setMenuList(res.data)
            })
    }, [arr])

    // 判断主菜单的子菜单的children存不存在，存在里面的子菜单的isshow是不是能显示
    const checkItemChildIsShow = (item) => {
        if (item.children === undefined && item.menuId) {
            return true;
        }
        let list = item.children.filter(data => data.isshow === false);
        return list.length === item.children.length && item.key !== '/home' ? false : true;
    }


    /**
     * 动态的创建菜单和子菜单的方法
     * @menuList    由菜单和子菜单组成的数据
     * @props       组件传递的路由数据
     * 返回的是菜单的jsx
     * **/
    const renderMenu = (menuList, props) => {
        return menuList.map(item => {
            if (item.children?.length > 0 && item.isshow && checkItemChildIsShow(item) && limits.includes(item.key)) {
                return <SubMenu key={item.key} icon={icons[item.key]} title={item.title}>
                    {renderMenu(item.children, props)}
                </SubMenu>
            }
            return item.isshow && checkItemChildIsShow(item) && limits.includes(item.key) && <Menu.Item key={item.key} icon={icons[item.key]}
                onClick={() => {
                    props.history.push(item.key)
                }
                }
            > {item.title}</Menu.Item >
        })
    }



    //该变量是菜单的底部的控制菜单的收缩的图标
    const shrinkIcon = (
        <div className='menu-footer-shrink' onClick={() => setCollapsed(!collapsed)}>
            {
                collapsed ?
                    <MenuUnfoldOutlined /> :
                    <MenuFoldOutlined />
            }
        </div>
    )


    let selectKey = props.location.pathname;
    let openKey = ['/' + selectKey.split('/')[1]];

    //组件内的props是没有值的，要使用withRouter高阶组件，渲染SideMenu后props才是有值的
    return (
        <Sider trigger={shrinkIcon} collapsedWidth="60px" collapsed={collapsed} collapsible className='layout-sider'>
            {/*  设置菜单的滚动条，将菜单的高度设为100% */}
            <div style={{ display: "flex", height: '100%', "flexDirection": "column" }}>
                <div style={{ flex: 1, 'overflow': "auto" }}>
                    <Menu
                        mode="inline"
                        defaultOpenKeys={JSON.parse(localStorage.getItem('token')).role.level === 10 ? openKey : arr}
                        selectedKeys={[selectKey]}
                        style={{ height: '100%' }}
                    >
                        {/* 下面的方式是动态渲染菜单页面的 */}
                        {renderMenu(menuList, props)}
                    </Menu>
                </div>
            </div>

        </Sider>
    );

}

// 使用withRouter使得SideMenu的props不为null
export default withRouter(SideMenu);