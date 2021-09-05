import React from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import Login from '../views/Login/Login';
import NewsControlHome from '../views/NewsControlHome/NewsControlHome';

function Router(props) {
    return (

        <HashRouter>
            <Switch>
                <Route path="/login" component={Login}></Route>
                {/* <Route path="/" component={NewsControlHome}></Route> */}
                {/*等价于上面的加载NewsControlHome组件 */}
                <Route path="/" render={() =>
                    localStorage.getItem("token") ?
                        <NewsControlHome></NewsControlHome> :
                        <Redirect to="/login" ></Redirect>
                }></Route>
            </Switch>
        </HashRouter>

    );
}

export default Router;