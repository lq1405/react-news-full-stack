import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Modal, Button, Switch, Table, Tag, Popover } from 'antd'
import { CheckOutlined, CloseOutlined, DeleteOutlined, ExclamationCircleOutlined, FormOutlined } from "@ant-design/icons"
const { confirm } = Modal;

function PermitList(props) {
	const [dataList, setDataList] = useState([]);
	// const [modalVisible, setModalVisible] = useState(false);

	useEffect(() => {
		axios.get('http://localhost:8000/menus?_embed=children')
			.then(res => {
				const list = res.data;
				list.forEach(item => {
					if (item.children.length === 0) {
						item.children = '';
					}
				})
				setDataList(list)
			});
	}, [])

	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			key: 'id',
			render: id => {
				return <b>{id}</b>
			}
		},
		{
			title: "权限名称",
			dataIndex: "title",
			key: 'title'
		},
		{
			title: "权限路由",
			dataIndex: "key",
			key: 'key',
			render: key => {
				return <Tag color="processing">{key}</Tag>
			}
		},
		{
			title: "状态",
			dataIndex: "isshow",
			key: 'isshow',
			render: (isshow) => (
				<Switch
					checkedChildren={<CheckOutlined />}
					unCheckedChildren={<CloseOutlined />}
					checked={isshow}
				/>
			)
		},
		{
			title: '操作',
			render: (item) => {
				return (<div>
					<Button
						style={{ marginRight: '10px' }}
						danger shape="circle"
						icon={<DeleteOutlined />}
						onClick={() => deleteConfirm(item)}
					></Button>

					<Popover title="页面配置"
						content={
							<Switch
								checkedChildren="开启"
								unCheckedChildren="关闭"
								checked={item.isshow}
								onClick={() => {
									item.isshow = !item.isshow;
									if (item.mainmenu) {
										axios.patch(`http://localhost:8000/menus/${item.id}`, {
											isshow: item.isshow,
										})
									} else {
										axios.patch(`http://localhost:8000/children/${item.id}`, {
											isshow: item.isshow,
										})
									}
									setDataList([...dataList]);

								}} />
						}
					>
						<Button
							type="primary" shape="circle"
							icon={<FormOutlined />}
							style={{ marginRight: '10px' }}
						></Button>
					</Popover>
					{/* 
					{item.mainmenu && <Button
						type="primary" shape="circle"
						icon={<PlusCircleOutlined />}
						onClick={() => setModalVisible(true)}
					></Button>
					} */}
				</div >)
			}
		}
	]


	const deleteConfirm = (item) => {
		confirm({
			title: "您确定删除吗？",
			icon: <ExclamationCircleOutlined />,
			content: "当您点击OK的时候，该项权限将被删除！",
			onOk() {
				deleteMethod(item)
			}
		})
	}
	const deleteMethod = (item) => {
		console.log(item)
		if (item.mainmenu) {
			setDataList(dataList.filter(data => data.key !== item.key));
			axios.delete(`http://localhost:8000/menus/${item.id}`);
		} else {

			let list = dataList.filter(data => data.id === item.menuId);
			list[0].children = list[0].children.filter(data => data.id !== item.id);
			axios.delete(`http://localhost:8000/children/${item.id}`);

			setDataList([...dataList]);
		}
	}

	return (
		<Table columns={columns}
			// expandable={{ rowExpandable: true }}
			dataSource={dataList}
		></Table>
	);
}

export default PermitList;