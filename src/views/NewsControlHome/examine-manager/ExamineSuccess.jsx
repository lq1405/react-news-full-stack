import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { PageHeader, Table, Tabs, Tag, Button, Modal, notification } from 'antd';
import { releaseStateList } from '../../../util/stateManageFile';

const { TabPane } = Tabs;
const { confirm } = Modal;

export default function ExamineSuccess() {

    const [currentExamineNews, setCurrentExamineNews] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [activeKey, setActiveKey] = useState('1');
    const [newsTypeList, setNewsTypeList] = useState([]);

    const { id, role } = JSON.parse(localStorage.getItem('token'));
    const level = role.level;

    useEffect(() => {
        axios.get(`/news?reviewerId=${id}&examineState=2&delete=false`)
            .then(res => {
                console.log(4444, res.data);
                setDataSource(res.data)
            })
        axios.get(`/news?authorId=${id}&examineState=2&delete=false`)
            .then(res => {
                console.log(333, res.data)
                setCurrentExamineNews(res.data)
            })

        axios.get(`/newsTypes`).then(res => setNewsTypeList(res.data));
        if (level === 0) {
            setActiveKey('2');
        }
    }, [id, level]);

    const columns = [
        {
            title: 'ID', dataIndex: 'id', width: 100,
            sorter: (a, b) => a.id - b.id,
            render: id => <b>{id}</b>
        },
        {
            title: '新闻标题',
            dataIndex: 'title',
            width: '35%',
            ellipsis: true,
            render: (title, item) => { return <a href={`#/news-manager/preview/${item.id}`}>{title}</a> }
        },
        { title: '新闻作者', dataIndex: 'author' },
        {
            title: '新闻类型', dataIndex: 'newsType',
            filters: [...newsTypeList.map(item => ({ text: item.typeName, value: item.typeName }))],
            onFilter: (value, item) => item.newsType === value,
        },
        {
            title: '发布状态',
            dataIndex: 'releaseState',
            filters: [...releaseStateList.map(item => ({ text: item.value, value: item.state }))],
            onFilter: (value, item) => item.releaseState === value,
            render: (releaseState) =>
                <Tag color={releaseStateList[releaseState].color}>
                    {releaseStateList[releaseState].value}
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
                                        <p>新闻{item.title}已审核成功！</p>
                                        <p>点击 ‘确认’ ，本条新闻则审核状态变为 ‘失败’ ，若新闻已发布，将强制将新闻下线</p>
                                    </div>
                                ),
                                okText: '确认', cancelText: '取消',
                                onOk: () => {
                                    setDataSource(dataSource.filter(data => data.id !== item.id));
                                    axios.patch(`/news/${item.id}`, {
                                        examineState: 3,
                                        releaseState: item.releaseState === 1 ? 0 : 3,
                                        examineTime: Date.now(),
                                    })
                                }
                            })

                        }}
                    >
                        撤销审核
                    </Button>}
                    {
                        activeKey === '2' &&
                        <div>
                            <Button danger type='primary'
                                style={{ marginRight: '10px' }}
                                onClick={() => {
                                    console.log(item);
                                    confirm({
                                        title: '删除新闻',
                                        content: <div>点击确认将删除新闻 “ {item.title} ”</div>,
                                        okText: '确认',
                                        cancelText: '取消',
                                        onOk: () => {
                                            console.log('ok');
                                            setCurrentExamineNews(currentExamineNews.filter(data => data.id !== item.id));
                                            axios.patch(`/news/${item.id}`, {
                                                delete: true,

                                            })
                                        }
                                    })
                                }}
                            >删除</Button>
                            {item.releaseState === 1 && <Button type='primary'
                                onClick={() => {
                                    axios.patch(`/news/${item.id}`, {
                                        releaseState: 2,
                                        releaseTime: Date.now()
                                    }).then(res => {
                                        setCurrentExamineNews(currentExamineNews.map(data => {
                                            if (data.id === item.id) {
                                                data.releaseState = 2;
                                                data.releaseTime = Date.now();
                                            }
                                            return data;
                                        }))
                                        console.log(res.data)
                                        notification.info({
                                            message: '新闻发布成功',
                                            duration: 3,
                                            placement: 'topRight',
                                        })
                                    })
                                }}
                            >发布</Button>}
                        </div>}
                </div >
            }
        }
    ]



    return (
        <div>
            <PageHeader title="审核通过"></PageHeader>
            <Tabs
                style={{ marginLeft: '24px' }}
                size='large'
                activeKey={activeKey}
                onTabClick={(data1, data2) => setActiveKey(data1)}
            >
                {level !== 0 && <TabPane key='1' tab='我的审核'>
                    <Table dataSource={dataSource}
                        columns={columns}
                        rowKey='id'
                    ></Table>
                </TabPane>}
                <TabPane key='2' tab='我的新闻'>
                    <Table dataSource={currentExamineNews}
                        columns={columns}
                        rowKey='id'
                    ></Table>
                </TabPane>
            </Tabs>
        </div>
    )
}
