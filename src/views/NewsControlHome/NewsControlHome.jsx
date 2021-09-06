import React, { useEffect } from 'react';
import SideMenu from '../../components/SideMenu';
import TopHeader from '../../components/TopHeader';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'

//
import './index.scss'

// 引入antd
import { Layout } from 'antd';
import RouterSwitch from '../../components/RouterSwitch/RouterSwitch';
const { Content } = Layout;

function NewsControlHome(props) {
    NProgress.start();
    useEffect(() => {
        NProgress.done();
    })
    return (
        <Layout>
            <TopHeader></TopHeader>
            <Layout>
                <SideMenu></SideMenu>
                <Layout>
                    <Content className="site-layout-content">
                        <RouterSwitch></RouterSwitch>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default NewsControlHome;