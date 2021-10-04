import { PageHeader, Table, Button, notification } from 'antd'
import React, { useEffect, useState } from 'react'
import axios from 'axios';

export default function NewTypes() {

	const [dataSource, setDataSource] = useState([]);

	useEffect(() => {
		axios.get('/newsTypes')
			.then(res => setDataSource(res.data));
	}, [])

	const columns = [
		{ title: 'ID', dataIndex: "id", width: 100, render: id => <b>{id}</b> },
		{
			title: '新闻类型', dataIndex: 'typeName'
		},
		{
			title: '操作',
			render: (item) => {

				return <div>
					<Button style={{ marginRight: '10px' }} type='primary'
						onClick={() => {
							console.log(item);
							axios.delete(`/newsTypes/${item.id}`)
								.then(res => {
									console.log(res.data);
									setDataSource(dataSource.filter(data => data.id !== item.id));
									notification.info({
										message: '新闻类型已删除!!!',
										duration: 3,
										placement: 'topRight'
									})
								})
						}}
					>删除</Button>
				</div>
			}
		}
	]
	return (
		<div>
			<PageHeader title='新闻分类'></PageHeader>

			<Table
				style={{ marginLeft: '24px' }}
				dataSource={dataSource}
				columns={columns}
				rowKey='id'
			></Table>
		</div>
	)
}
