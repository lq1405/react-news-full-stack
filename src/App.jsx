import { useEffect } from 'react';
import './App.css';
import axios from 'axios';
import Router from './router';

function App() {

	useEffect(() => {
		axios.get("/splcloud/fcgi-bin/gethotkey.fcg?_=1630124021333&cv=4747474&ct=24&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=1&uin=0&g_tk_new_20200303=5381&g_tk=5381&hostUin=0").then(res => {
			console.log(res.data)
		})
	}, [])
	return (

			<Router></Router>

	)
}

export default App;
