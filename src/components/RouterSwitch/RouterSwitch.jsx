import React, { useEffect, useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import Home from '../../views/NewsControlHome/Home/Home';
import NoPage from '../../views/NewsControlHome/NoPage/NoPage';
import PermitList from '../../views/NewsControlHome/permit-manager/PermitList/PermitList';
import PermitUserList from '../../views/NewsControlHome/permit-manager/PermitUserList/PermitUserList';
import UserList from '../../views/NewsControlHome/UserList/UserList';


const routeList = {
    "/home": Home,
    "/user-manager/list": UserList,
    "/permit-manager/user-list": PermitUserList,
    "/permit-manager/permit-type-list": PermitList,

}

export default function RouterSwitch() {

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
        return item.mainmenu === 1 ? false : true;
    }
    return (
        <Switch>

            {backRouteList.map(item => {
                return item.isshow && checkChildren(item) &&
                    JSON.parse(localStorage.getItem('token')).role.limits.includes(item.key) &&
                    <Route path={item.key} key={item.key}
                        component={routeList[item.key]} exact
                    ></Route>
            })}

            <Redirect exact from='/' to='/home'></Redirect>

            {backRouteList.length > 0 && <Route path='*' component={NoPage}></Route>}
        </Switch>
    )
}
