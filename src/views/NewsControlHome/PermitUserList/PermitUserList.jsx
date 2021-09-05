import { DeleteOutlined, ExclamationCircleOutlined, UnorderedListOutlined, OrderedListOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Tree, List } from 'antd'
import axios from 'axios';

function PermitUserList(props) {

    const [dataList, setDataList] = useState([]);
    const [limitList, setLimitList] = useState([]);
    const [currentLimitList, setCurrentLimitList] = useState([]);
    const [currentId, setCurrentId] = useState(0)
    const [currentLimitUserList, setCurrentLimitUserList] = useState([])
    const [showListModal, setShowListModal] = useState(false);
    const [showRoleUserList, setShowRoleUserList] = useState(false)
    const [showCreatePermitList, setShowCreatePermitList] = useState(false)

    const [cachePermit, setCachePermit] = useState([])


    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: id => <b>{id}</b>
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
        },
        {
            title: "权限级别",
            dataIndex: 'level',
            render: level => <b>{level}</b>
        },
        {
            title: '操作',
            render: (item) => {
                return (
                    <div>
                        <Button
                            style={{ marginRight: '10px' }}
                            danger shape="circle"
                            icon={<DeleteOutlined />}
                            onClick={() => deleteConfirm(item)}
                        ></Button>
                        <Button
                            type='primary'
                            style={{ marginRight: '10px' }} shape="circle"
                            icon={<UnorderedListOutlined />}
                            onClick={() => {
                                axios.get('http://localhost:8000/menus?_embed=children')
                                    .then(res => {
                                        console.log(res.data)
                                        setLimitList(res.data)
                                    });
                                axios.get(`http://localhost:8000/roles/${item.id}`)
                                    .then(res => {
                                        console.log(res.data.limits)
                                        setCurrentLimitList(res.data.limits.filter(item => item.split('/').length > 2 || item === '/home'))
                                    })
                                setShowListModal(true)
                                setCurrentId(item.id)
                            }}
                        ></Button>
                        <Modal
                            title="选择角色的权限"
                            visible={showListModal}
                            mask={false}
                            onOk={() => {
                                setShowListModal(false)
                                setCurrentLimitList(currentLimitList)
                                axios.patch(`http://localhost:8000/roles/${currentId}`, {
                                    limits: [...currentLimitList, ...cachePermit]
                                })
                                console.log(currentLimitList)
                            }}
                            onCancel={() => setShowListModal(false)}
                            okText="确认" cancelText="取消"

                        >
                            <Tree
                                checkable
                                treeData={limitList}
                                checkedKeys={currentLimitList}
                                onCheck={(checkedKeys, info) => {
                                    setCurrentLimitList(checkedKeys);
                                    setCachePermit(info.halfCheckedKeys);
                                }}
                            ></Tree>
                        </Modal>
                        <Button
                            type='primary'
                            shape="circle"
                            icon={<OrderedListOutlined />}
                            onClick={() => {
                                axios.get(`http://localhost:8000/roles/${item.id}?_embed=users`)
                                    .then(res => setCurrentLimitUserList(res.data.users)
                                    )
                                setShowRoleUserList(true)
                                setCurrentId(item.id)
                            }}
                        >
                        </Button>
                        <Modal
                            title="分配该角色的用户"
                            mask={false}
                            visible={showRoleUserList}
                            onOk={() => setShowRoleUserList(false)}
                            onCancel={() => setShowRoleUserList(false)}
                            okText="确认" cancelText="取消"
                        >
                            <List
                                style={{ height: '400px', overflow: 'auto' }}
                                dataSource={currentLimitUserList}
                                rowKey="id"
                                renderItem={data => {
                                    console.log(data)
                                    return (<List.Item key={data.id} >
                                        <List.Item.Meta style={{ padding: "8px 20px" }} title={data.username} />
                                    </List.Item>
                                    )
                                }}
                            />
                        </Modal >
                    </div >
                )
            }
        }

    ]

    //修改权限的函数方法
    // const 


    // 删除权限用户的两个方法
    const deleteConfirm = item => {
        Modal.confirm({
            title: "您确定删除吗？",
            icon: <ExclamationCircleOutlined />,
            content: "当您点击 确认 的时候，该用户权限集合将被删除！",
            onOk() {
                deleteMethod(item)
            },
            okText: '确认',
            cancelText: '取消',
        })
    }
    const deleteMethod = item => {
        setDataList(dataList.filter(data => data.id !== item.id));
        axios.delete(`http://localhost:8000/roles/${item.id}`);
    }
    useEffect(() => {
        axios.get("http://localhost:8000/roles").then(res => setDataList(res.data));
    }, [])


    return (
        <div>
            <Button style={{ marginBottom: '10px' }} type="primary"
                onClick={() => {
                    setShowCreatePermitList(true);
                }}
            >添加权限用户</Button>
            <Modal visible={showCreatePermitList}
                title="创建新的用户权限"
                onCancel={() => { setShowCreatePermitList(false) }}
                onOk={() => { setShowCreatePermitList(false) }}
            ></Modal>
            <Table
                dataSource={dataList}
                columns={columns}
                rowKey='id'
            ></Table>
        </div>
    );
}

export default PermitUserList;