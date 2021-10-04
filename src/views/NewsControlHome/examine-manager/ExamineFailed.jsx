import React, { useEffect, useState } from 'react'
import { PageHeader, Table, Tabs, Tag, Modal, Button, Tooltip, notification, Form } from 'antd'
import axios from 'axios';
import { examineStateList } from '../../../util/stateManageFile';
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import NewsEditForm from '../../../components/news-manager/NewsEditForm';

const { TabPane } = Tabs;
const { confirm } = Modal;

export default function ExamineFailed() {

    const [dataSource, setDataSource] = useState([]);
    const [currentUserNews, setCurrentUserNews] = useState([]);
    const [activeKey, setActiveKey] = useState('1');
    const [newsTypeList, setNewsTypeList] = useState([]);
    const [title, setTitle] = useState('');
    const [newsType, setNewsType] = useState('');
    const [content, setContent] = useState('');
    const [currentId, setCurrentId] = useState(0);
    const [showNewEditModal, setShowNewEditModal] = useState(false);

    const [form] = Form.useForm();
    const { id, role } = JSON.parse(localStorage.getItem('token'));
    const level = role.level;
    useEffect(() => {
        axios.get(`/news?reviewerId=${id}&examineState=3`)
            .then(res => {
                console.log(res.data)
                setDataSource(res.data);
            })
        axios.get(`/news?authorId=${id}&examineState=3&delete=false`)
            .then(res => {
                console.log(res.data);
                setCurrentUserNews(res.data)
            })
        axios.get('/newsTypes')
            .then(res => {
                setNewsTypeList(res.data);
            })
    }, [id, level])

    const columns = [
        { title: 'ID', dataIndex: 'id', width: 100, sorter: (a, b) => a.id - b.id, render: id => <b>{id}</b> },
        {
            title: "新闻标题",
            dataIndex: 'title',
            width: '35%',
            ellipsis: true,

            render: (title, item) => <a href={`#/news-manager/preview/${item.id}`}>{title}</a>
        },
        { title: '作者', dataIndex: 'author' },
        {
            title: '新闻分类', dataIndex: 'newsType',
            filters: [...newsTypeList.map(item => ({ text: item.typeName, value: item.typeName }))],
            onFilter: (value, item) => item.newsType === value,
        },
        {
            title: '审核状态',
            dataIndex: 'examineState',
            render: (examineState) =>
                <Tag color={examineStateList[examineState].color}>
                    {examineStateList[examineState].value}
                </Tag>
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    {activeKey === '1' && <Button type="primary" danger
                        onClick={() => {
                            confirm({
                                title: '确认撤销审核',
                                content: (
                                    <div>
                                        <p>新闻{item.title}已审核失败！</p>
                                        <p>点击 ‘确认’ ，本条新闻则审核状态变为 ‘成功’ </p>
                                    </div>
                                ),
                                okText: '确认', cancelText: '取消',
                                onOk: () => {
                                    setDataSource(dataSource.filter(data => data.id !== item.id));
                                    axios.patch(`/news/${item.id}`, {
                                        examineState: 2,
                                        releaseState: 1,
                                        examineTime: Date.now(),
                                    })
                                }
                            })

                        }}
                    >
                        撤销审核
                    </Button>}
                    {
                        activeKey === '2' && <div>
                            <Tooltip title='删除'>
                                <Button
                                    shape='circle' danger
                                    style={{ marginRight: '10px' }}
                                    icon={<DeleteOutlined />}
                                    onClick={() => {
                                        console.log(11111);
                                        confirm({
                                            title: '确认删除',
                                            content: `确认删除新闻  '${item.title}'`,
                                            okText: '确认', cancelText: '取消',
                                            onOk: () => {
                                                axios.patch(`/news/${item.id}`, {
                                                    delete: true,
                                                    examineState: 0,
                                                    releaseState: 0,
                                                    deleteTime: Date.now()
                                                }).then(res => {
                                                    setCurrentUserNews(currentUserNews.filter(data => data.id !== item.id));
                                                    notification.info({
                                                        message: '新闻删除成功！',
                                                        duration: 3,
                                                        placement: 'topRight',
                                                    })
                                                })
                                            }
                                        })
                                    }}
                                ></Button>
                            </Tooltip>

                            <Tooltip
                                title='修改'>
                                <Button
                                    shape='circle' type='primary'
                                    style={{ marginRight: '10px' }}
                                    icon={<EditOutlined />}
                                    onClick={() => {
                                        console.log(222222);
                                        setShowNewEditModal(true);
                                        form.setFieldsValue(item);
                                        setContent(item.content);
                                        setCurrentId(item.id);
                                        setTitle(item.title);
                                        setNewsType(item.newsType);
                                    }}
                                ></Button>
                            </Tooltip>

                            <Tooltip
                                title='上传审核'>
                                <Button
                                    shape='circle' type='primary'
                                    icon={<UploadOutlined />}
                                    onClick={() => {
                                        console.log(22222);
                                        confirm({
                                            title: '确认提交审核',
                                            content: `是否确认提价审核：${item.title}`,
                                            okText: "确认",
                                            cancelText: '取消',
                                            onOk: () => {
                                                axios.patch(`/news/${item.id}`, {
                                                    examineState: 1
                                                }).then(res => {
                                                    setCurrentUserNews(currentUserNews.filter(data => data.id !== item.id))
                                                    notification.info({
                                                        message: '提交审核成功',
                                                        description: '可以进入 “审核管理” 查看审核的进度和结果',
                                                        duration: 3,
                                                        placement: 'topRight'
                                                    })
                                                })
                                            }
                                        })
                                    }}
                                ></Button>
                            </Tooltip>

                        </div>
                    }
                </div >
            }
        }
    ]

    function getTitle(value) {
        console.log('title', value)
        if (value !== '') {
            setTitle(value);
        }
    }
    function getContent(value) {
        if (value !== '') {
            setContent(value);
        }
    }
    function getNewsType(value) {
        console.log('newsType', value)
        if (value !== '') {
            setNewsType(value);
        }
    }

    return (
        <div>
            <Modal
                title='修改新闻'
                visible={showNewEditModal}
                width="60%"
                okText="确认" cancelText="取消"
                onCancel={() => setShowNewEditModal(false)}
                onOk={() => {
                    console.log(title, newsType);
                    axios.patch(`/news/${currentId}`, {
                        title,
                        content,
                        newsType
                    }).then(res => {
                        setShowNewEditModal(false)
                        setCurrentUserNews(currentUserNews.map(data => {
                            if (data.id === currentId) {
                                return { ...data, title: title, content: content, newsType: newsType }
                            }
                            return data;
                        }))
                    })
                }}
            >
                <NewsEditForm
                    form={form}
                    newsTypeList={newsTypeList}
                    content={content}
                    getTitle={(value) => getTitle(value)}
                    getNewsType={(value) => getNewsType(value)}
                    getContent={(value) => getContent(value)}
                ></NewsEditForm>
            </Modal>



            <PageHeader title='审核违规'></PageHeader>
            <Tabs
                style={{ marginLeft: '24px' }}
                activeKey={activeKey} size='large'
                onTabClick={(data) => {
                    setActiveKey(data);
                }}
            >
                {level !== 0 && <TabPane key='1' tab="我的审核">
                    <Table
                        dataSource={dataSource}
                        rowKey='id'
                        columns={columns}
                    ></Table>
                </TabPane>}
                <TabPane key='2' tab="我的新闻">
                    <Table
                        dataSource={currentUserNews}
                        rowKey='id'
                        columns={columns}
                    ></Table>
                </TabPane>
            </Tabs>
        </div>
    )
}
