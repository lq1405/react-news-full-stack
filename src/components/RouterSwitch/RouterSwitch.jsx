import React, { useEffect, useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import { Spin } from 'antd'
import Home from '../../views/NewsControlHome/Home/Home';
import NoPage from '../../views/NewsControlHome/NoPage/NoPage';
import PermitList from '../../views/NewsControlHome/permit-manager/PermitList/PermitList';
import PermitUserList from '../../views/NewsControlHome/permit-manager/PermitUserList/PermitUserList';
import UserList from '../../views/NewsControlHome/UserList/UserList';
import NewsAdd from '../../views/NewsControlHome/news-manager/NewsAdd';
import NewsDraft from '../../views/NewsControlHome/news-manager/NewsDraft';
import NewsPreview from '../../views/NewsControlHome/news-manager/NewsPreview';
import WillExamine from '../../views/NewsControlHome/examine-manager/WillExamine';
import ExamineSuccess from '../../views/NewsControlHome/examine-manager/ExamineSuccess';
import ExamineFailed from '../../views/NewsControlHome/examine-manager/ExamineFailed';
import WillRelease from '../../views/NewsControlHome/release-manager/WillRelease';
import NewTypes from '../../views/NewsControlHome/news-manager/NewTypes';
import ReleasedNews from '../../views/NewsControlHome/release-manager/ReleasedNews';
import ReleaseOffline from '../../views/NewsControlHome/release-manager/ReleaseOffline';
import NewsDelete from '../../views/NewsControlHome/news-manager/NewsDelete';
import { connect } from 'react-redux';


const routeList = {
    "/home": Home,
    "/user-manager/list": UserList,
    "/permit-manager/user-list": PermitUserList,
    "/permit-manager/permit-type-list": PermitList,
    "/news-manager/write-news": NewsAdd,
    '/news-manager/draft': NewsDraft,
    '/news-manager/delete': NewsDelete,
    "/examine-manager/no-check": WillExamine,
    "/examine-manager/check-success": ExamineSuccess,
    '/examine-manager/check-fail': ExamineFailed,
    '/release-manager/no-release': WillRelease,
    '/news-manager/news-type': NewTypes,
    '/release-manager/released': ReleasedNews,
    "/release-manager/offline": ReleaseOffline
}

function RouterSwitch(props) {
    // console.log(props)

    const [backRouteList, setBackRouteList] = useState([])

    useEffect(() => {
        Promise.all([
            axios.get('/menus'),
            axios.get('/children')
        ]).then(res => {
            // console.log([...res[0].data, ...res[1].data]);
            setBackRouteList([...res[0].data, ...res[1].data])
        })
    }, [])
    const checkChildren = (item) => {
        return item.mainmenu === 1 && item.key !== '/home' ? false : true;
    }
    return (

        <Spin spinning={props.loading}>
            {/* {console.log(props)} */}
            <Switch>

                {backRouteList.map(item => {
                    return item.isshow && checkChildren(item) &&
                        JSON.parse(localStorage.getItem('token')).role.limits.includes(item.key) &&
                        <Route path={item.key} key={item.key}
                            component={routeList[item.key]} exact
                        ></Route>
                })}

                <Route path="/news-manager/preview/:id" component={NewsPreview}></Route>

                <Redirect exact from='/' to='/news-manager/write-news'></Redirect>

                {backRouteList.length > 0 && <Route path='*' component={NoPage}></Route>}
            </Switch>
        </Spin>
    )
}

const data = (state) => {
    // console.log(state.LoadingReducer);
    return {
        loading: state.LoadingReducer
    }
}
export default connect(data)(RouterSwitch);
