import React, { useEffect, useState } from 'react'
import { Button, Form, message, notification, PageHeader, Tabs } from 'antd';
import axios from 'axios';
import NewsEditForm from '../../../../components/news-manager/NewsEditForm';
const { TabPane } = Tabs;


export default function NewsAdd(props) {

    const [title, setTitle] = useState('');
    const [newsType, setNewsType] = useState('');
    const [content, setContent] = useState('');
    const [roleList, setRoleList] = useState([])
    const [newsTypeList, setNewsTypeList] = useState([]);

    const User = JSON.parse(localStorage.getItem('token'));

    const [form] = Form.useForm();

    useEffect(() => {
        axios.get('/newsTypes').then(res => {
            console.log(res.data)
            setNewsTypeList(res.data)
        });
        axios.get(`/users?_expand=role`)
            .then(res => {
                setRoleList(res.data.filter(data => data.role.level === 10 || data.role.level === 8))
            })
    }, [])


    //状态：审核状态：0-未审核,在草稿箱中   1-审核中 2-审核通过  3-审核失败
    // 发布状态： 0-未审核未发布 1-已审核待发布 2-已发布 3-已下线 

    const submitData = (examineState) => {
        axios.post('/news', {
            title,
            newsType,
            content,
            author: User.username,
            authorId: User.id,
            examineState,
            releaseState: 0,
            createTime: Date.now(),
            view: 0,
            star: 0,
            newsTypeId: newsTypeList.filter(data => data.typeName === newsType)[0].id,
            reviewerId: roleList[Math.floor(Math.random() * 3)].id,
            delete: false
        })
    }
    function getTitle(value) {
        console.log(111, value);
        setTitle(value);
    }
    function getContent(value) {
        console.log(2222, value);
        setContent(value);
    }
    function getNewsType(value) {
        console.log(3333, value);
        setNewsType(value);
    }


    return (
        <div>
            <PageHeader style={{ paddingLeft: '100px' }}
                title="撰写新闻"
            ></PageHeader>

            <Tabs size="large" style={{ marginLeft: '100px', width: '60%' }}>
                <TabPane tab="文字新闻" key="1">
                    <div style={{ marginTop: '20px' }}>

                        <NewsEditForm
                            newsTypeList={newsTypeList}
                            getTitle={(value) => getTitle(value)}
                            getNewsType={(value) => getNewsType(value)}
                            getContent={(value) => getContent(value)}
                            form={form}></NewsEditForm>

                        <Button type="primary" style={{ marginRight: '10px' }}
                            onClick={() => {
                                form.validateFields()
                                    .then(res => {
                                        if (content !== '' && content.trim() !== '<p></p>') {
                                            console.log(222, res)
                                            submitData(0);
                                            notification.info({
                                                message: '通知',
                                                description: "保存草稿成功，即将前往草稿箱界面！",
                                                placement: 'topRight',
                                            })
                                            setTimeout(() => {
                                                props.history.push('/news-manager/draft');
                                                form.resetFields();
                                            }, 1000)
                                        } else {
                                            message.config({ maxCount: 1 });
                                            message.error({ content: "新闻内容不能为空！" })
                                        }
                                    })
                            }}
                        >保存草稿</Button>
                        <Button type="primary"
                            onClick={() => {
                                submitData(1);
                                notification.info({
                                    message: '通知',
                                    description: "提交审核成功，即将前往待审核界面！",
                                    placement: 'topRight',
                                })
                                setTimeout(() => {
                                    props.history.push('/examine-manager/no-check');
                                    form.resetFields();
                                }, 1000)
                            }}
                        >提交审核</Button>
                    </div></TabPane>

                <TabPane tab="视频新闻" key="2">视频新闻</TabPane>
            </Tabs>


        </div >
    )
}
