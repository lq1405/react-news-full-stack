import React from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import DetailPage from '../views/browse/DetailPage';
import HomePage from '../views/browse/HomePage';
import Login from '../views/Login/Login';
import NewsControlHome from '../views/NewsControlHome/NewsControlHome';

function Router(props) {
    return (

        <HashRouter>
            <Switch>
                <Route path="/login" exact component={Login}></Route>
                <Route path='/news' exact component={HomePage}></Route>
                <Route path='/detail/:id' exact component={DetailPage}></Route>
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