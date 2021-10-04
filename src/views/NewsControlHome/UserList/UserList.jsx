import React, { useState, useEffect } from 'react';
import { Button, Modal, Table, Tag, Form, } from 'antd';
import axios from 'axios'
import { DeleteOutlined, ExclamationCircleOutlined, SettingOutlined } from '@ant-design/icons';
import CreateUserForm from '../../../components/user-manager/createUserForm';


function UserList(props) {

    const [dataSource, setDataSource] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [permitUserList, setPermitUserList] = useState([]);
    const [currentItem, setCurrentItem] = useState(null)

    useEffect(() => {
        axios.get('/users?_expand=role').then(res => {
            setDataSource(res.data.filter(item => item.role.level <= JSON.parse(localStorage.getItem('token')).role.level))
        })
    }, [])
    useEffect(() => {
        axios.get('/roles').then(res => {
            setPermitUserList(res.data.filter(item => item.level <= JSON.parse(localStorage.getItem('token')).role.level))
        });
    }, [])
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => <b>{id}</b>
        },
        {
            title: '用户名',
            dataIndex: 'username'
        },
        {
            title: "角色名称",
            dataIndex: 'role',

            filters: [
                ...permitUserList.map(item => ({ text: item.roleName, value: item.roleName }))
            ],
            onFilter: (value, item) => { return item.role.roleName === value },
            render: role => role.roleName,
        },
        {
            title: "用户状态",
            dataIndex: 'userState',

            filters: [{ text: 'action', value: 'action' },
            { text: 'warn', value: 'warn' },
            { text: 'cancel', value: 'cancel' }],
            onFilter: (value, item) => item.userState === value,

            render: userState => {
                let s = '';
                if (userState === 'action')
                    s = 'success';
                else if (userState === 'warn')
                    s = 'warning';
                else s = 'error';
                return <Tag style={{ fontSize: '16px' }} color={s}>{userState}</Tag>;
            },
        },
        {
            title: "操作",
            render: (item) => {

                return (<div>
                    <Button
                        disabled={!item.enableDelete}
                        style={{ marginRight: '10px' }}
                        danger shape="circle"
                        icon={<DeleteOutlined />}
                        onClick={() => deleteConfirm(item)}
                    ></Button>
                    <Button
                        disabled={!item.enableConfig}
                        style={{ marginRight: '10px' }}
                        shape="circle" type="primary"
                        icon={<SettingOutlined />}
                        onClick={() => {
                            setShowEditModal(true);
                            form.setFieldsValue(item);
                            setCurrentItem(item);
                        }}
                    ></Button>

                </div >)
            }
        }

    ]

    const deleteConfirm = (item) => {
        Modal.confirm({
            title: "您确定删除吗？",
            icon: <ExclamationCircleOutlined />,
            content: "当您点击 确认 的时候，该用户将被删除！",
            okText: '确认', cancelText: "取消",
            onOk() {
                axios.delete(`/users/${item.id}`);
                setDataSource(dataSource.filter(data => data.id !== item.id));
            }
        })
    }
    const [form] = Form.useForm();
    return (
        <div>
            <Button style={{ marginBottom: '10px' }} type="primary"
                onClick={() => {
                    setShowCreateModal(true);
                }}
            >添加新用户</Button>
            <Modal visible={showCreateModal}
                title="添加新用户"
                onCancel={() => {
                    setShowCreateModal(false)
                    form.resetFields();
                }}
                onOk={() => {
                    form.validateFields()
                        .then(res => {
                            axios.post('/users', {
                                ...res,
                                enableDelete: true,
                                enableConfig: true,
                            })
                                .then(data => {
                                    let list = permitUserList.filter(item => item.id === data.data.roleId);
                                    data.data.role = list[0];
                                    setDataSource([...dataSource, data.data])
                                    setShowCreateModal(false)
                                    form.resetFields();
                                })
                        })
                        .catch(err => { console.log(err) })
                }}
            >
                <CreateUserForm form={form}
                    permitUserList={permitUserList}
                ></CreateUserForm>
            </Modal>
            <Modal mask={false}
                title="修改用户信息"
                visible={showEditModal}
                onCancel={() => {
                    setShowEditModal(false)
                }}
                onOk={() => {
                    form.validateFields()
                        .then(res => {
                            setDataSource(dataSource.map(item => {
                                if (item.id === currentItem.id) {
                                    return { ...item, ...res, role: permitUserList.filter(data => data.id === res.roleId)[0] }
                                }
                                return item;
                            }))
                            setShowEditModal(false);
                            axios.patch(`/users/${currentItem.id}`, res);
                        });
                }}>
                <CreateUserForm form={form} permitUserList={permitUserList}></CreateUserForm>
            </Modal>
            <Table
                columns={columns} rowKey="id"
                dataSource={dataSource}
            ></Table>
        </div >
    );
}

export default UserList;