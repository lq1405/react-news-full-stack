import { Button, PageHeader, Table, Tabs, Tag, Tooltip, Modal, notification } from 'antd'
import { CheckOutlined, CloseOutlined, ExclamationCircleTwoTone, setTwoToneColor } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { examineStateList } from '../../../util/stateManageFile';


const { TabPane } = Tabs;
const { confirm } = Modal;


export default function WillExamine() {

    const [dataSource, setDataSource] = useState([]);
    const [currentUserNews, setCurrentUserNews] = useState([]);
    const [activeKey, setActiveKey] = useState('1');

    const { role, id } = JSON.parse(localStorage.getItem('token'));
    const level = role.level;

    useEffect(() => {
        //请求的是自己写的新闻
        axios.get(`/news?authorId=${id}&examineState=1`)
            .then(res => {
                console.log(111, res.data);
                setCurrentUserNews(res.data);
            })
        //请求的是要审核的新闻
        axios.get(`/news?examineState=1&reviewerId=${id}`)
            .then(res => {
                console.log(222, res.data);
                setDataSource(res.data);
            })
        if (level === 0) {
            setActiveKey('2');
        }

    }, [level, id])

    function examineFunction(item, num) {
        console.log(item);
        axios.patch(`/news/${item.id}`, {
            examineState: num,
            releaseState: num === 2 ? 1 : 0,
            examineTime: Date.now(),
        }).then(res => {
            setDataSource(dataSource.filter(data => data.id !== item.id))
            notification.open({
                message: '审核成功',
                description: `可以前往 ${num === 2 ? '审核成功' : '审核失败'} 页面查看！`,
                duration: 3
            })
        });
    }

    const columns = [
        { title: 'ID', dataIndex: 'id', width: 150, render: id => <b>{id}</b> },
        {
            title: '新闻标题',
            dataIndex: 'title',
            width: '40%',
            ellipsis: true,
            render: (title, item) => <a href={`#/news-manager/preview/${item.id}`}>{title}</a>

        },
        { title: '新闻作者', dataIndex: 'author' },
        { title: '新闻类型', dataIndex: 'newsType' },
        {
            title: '审核状态',
            dataIndex: 'examineState',
            render: (examineState) => examineState === 1 &&
                <Tag color={examineStateList[examineState].color}>
                    {examineStateList[examineState].value}
                </Tag>
        },
        {
            title: '操作',
            render: item => {
                return <div>
                    {activeKey === '1' && <div>
                        <Tooltip placement='top' title="审核通过">
                            <Button
                                style={{ marginRight: '10px' }}
                                type='primary' shape='circle'
                                icon={<CheckOutlined />}
                                onClick={() => {
                                    confirm({
                                        title: '确认通过审核',
                                        content: `确定通过新闻审核：${item.title}`,
                                        onOk: () => examineFunction(item, 2),
                                        okText: '确认',
                                        cancelText: '取消',
                                    })
                                }}
                            ></Button>
                        </Tooltip>
                        <Tooltip placement='top' title="审核失败">
                            <Button
                                shape='circle' danger
                                icon={<CloseOutlined />}
                                onClick={() => {
                                    setTwoToneColor('#faad14');
                                    confirm({
                                        title: '确认审核失败',
                                        icon: <ExclamationCircleTwoTone />,
                                        content: `点击确认，该新闻 ‘${item.title}’ 将审核失败`,
                                        okText: '确认',
                                        cancelText: "取消",
                                        onOk: () => examineFunction(item, 3),
                                    })
                                }}
                            ></Button>
                        </Tooltip>
                    </div>}
                    {
                        activeKey === '2' && <Button danger
                            onClick={() => {
                                console.log(item);
                                setCurrentUserNews(currentUserNews.filter(data => data.id !== item.id));
                                axios.patch(`/news/${item.id}`, { examineState: 0 })
                                notification.open({
                                    message: '您已经撤回审核',
                                    description: '您可以前往草稿箱中查看和修改撤回的新闻',
                                    duration: 3
                                })
                            }}
                        >
                            撤回审核
                        </Button>
                    }
                </div>
            }
        }
    ]

    return (
        <div>
            <PageHeader
                title="待审核"
            ></PageHeader>
            <Tabs size='large' style={{ marginLeft: '24px' }}
                activeKey={activeKey}
                onTabClick={(data1, data2) => {
                    if (level !== 0) {
                        console.log(22222222, data1, data2);
                        setActiveKey(data1);
                    }

                }}
            >
                {role.level > 0 && <TabPane tab=' 我的审核' key='1'>
                    <Table columns={columns}
                        dataSource={dataSource}
                        rowKey='id'
                    ></Table>

                </TabPane>}
                <TabPane tab='我的待审核' key='2'
                >
                    <Table
                        dataSource={currentUserNews}
                        columns={columns}
                        rowKey='id'
                    ></Table>
                </TabPane>
            </Tabs>
        </div >
    )
}
