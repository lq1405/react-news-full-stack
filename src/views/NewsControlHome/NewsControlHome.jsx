import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import SideMenu from '../../components/SideMenu';
import TopHeader from '../../components/TopHeader';
import Home from './Home/Home';
import UserList from './UserList/UserList';
import PermitUserList from "./PermitUserList/PermitUserList";
import PermitList from "./PermitList/PermitList";
import NoPage from './NoPage/NoPage';
import menuManager from './menuManager';

//
import './index.scss'

// 引入antd
import { Layout } from 'antd';
const { Content } = Layout;

function NewsControlHome(props) {
    return (
        <Layout>
            <TopHeader></TopHeader>
            <Layout>
                <SideMenu></SideMenu>

                <Layout className="site-layout-content">
                    <Content>
                        <Switch>
                            <Route path='/home' component={Home}></Route>
                            <Route path='/user-manager/list/:page' component={UserList}></Route>
                            <Route path='/permit-manager/user-list/:page' component={PermitUserList}></Route>
                            <Route path='/permit-manager/permit-type-list' component={PermitList}></Route>

                            <Route path='/menu-manager' component={menuManager}></Route>

                            <Redirect exact from='/' to='/home'></Redirect>



                            <Route path='*' component={NoPage}></Route>
                        </Switch>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default NewsControlHome;