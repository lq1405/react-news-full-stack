import React, { useEffect, useState } from 'react'
import { PageHeader, Button, Descriptions, Tag, notification } from 'antd';
import axios from 'axios';
import NoPage from '../NoPage/NoPage';
import moment from 'moment';
import { examineStateList, releaseStateList } from '../../../util/stateManageFile';

export default function NewsPreview(props) {
    const [newsInfo, setNewsInfo] = useState(null);

    const { id } = JSON.parse(localStorage.getItem('token'));

    useEffect(() => {
        axios.get(`/news?authorId=${id}&id=${props.match.params.id}`)
            .then(res => {
                if (res.data.length === 0) {
                    axios.get(`/news?reviewerId=${id}&id=${props.match.params.id}`)
                        .then(data => {
                            setNewsInfo(data.data[0]);
                        })
                } else {
                    setNewsInfo(res.data[0]);
                }
            });

    }, [id, props.match.params.id])

    function checkButtonShow(newsInfo) {
        console.log(id, newsInfo.authorId, newsInfo);
        if (id === 1 && newsInfo.examineState === 1) {
            console.log(333333333333333333);
            return true;
        } else if (id === newsInfo.authorId) {

            return false;
        }
        return true;
    }



    function examineFunction(item, num) {
        console.log(item);
        axios.patch(`/news/${item.id}`, {
            examineState: num,
            releaseState: num === 2 ? 1 : 0,
            examineTime: Date.now(),
        }).then(res => {
            // setDataSource(dataSource.filter(data => data.id !== item.id))
            setNewsInfo({ ...newsInfo, examineState: num, releaseState: num === 2 ? 1 : 0, examineTime: Date.now() })
            notification.open({
                message: '审核成功',
                description: `可以前往 ${num === 2 ? '审核成功' : '审核失败'} 页面查看！`,
                duration: 3
            })
        });
    }

    return (
        <div>
            {newsInfo && <div>
                <PageHeader
                    ghost={false}
                    onBack={() => window.history.back()}
                    title={newsInfo.title}
                >
                    <Descriptions size="default" column={3}>
                        <Descriptions.Item label="作者">{newsInfo.author}</Descriptions.Item>
                        <Descriptions.Item label="新闻类型">{newsInfo.newsType}</Descriptions.Item>
                        <Descriptions.Item label="创建时间">{moment(newsInfo.createTime).format('YYYY/MM/DD  hh:mm:ss')}</Descriptions.Item>
                        <Descriptions.Item label="审核状态" >{
                            <Tag color={examineStateList[newsInfo.examineState].color}>
                                {examineStateList[newsInfo.examineState].value}
                            </Tag>
                        }</Descriptions.Item>
                        <Descriptions.Item label="审核时间">
                            {newsInfo.examineTime ?
                                moment(newsInfo.examineTime).format('YYYY/MM/DD  hh:mm:ss') : '-'
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="发布状态">
                            {
                                <Tag color={releaseStateList[newsInfo.releaseState].color}>
                                    {releaseStateList[newsInfo.releaseState].value}
                                </Tag>
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="发布时间">
                            {newsInfo.releaseTime ?
                                moment(newsInfo.examineTime).format('YYYY/MM/DD  hh:mm:ss') : '-'
                            }
                        </Descriptions.Item>
                    </Descriptions>
                </PageHeader>
                <div style={{ margin: '0 24px' }} dangerouslySetInnerHTML={{
                    __html: newsInfo.content
                }}></div>

                <div style={{
                    display: checkButtonShow(newsInfo) ? '' : 'none',
                    marginTop: '50px'
                }}>
                    <Button
                        type='primary'
                        style={{ marginRight: '20px' }}
                        onClick={() => examineFunction(newsInfo, 2)}
                    >审核通过</Button>
                    <Button danger
                        onClick={() => examineFunction(newsInfo, 3)}
                    >审核失败</Button>
                </div>
            </div>}
            {newsInfo === undefined && <NoPage></NoPage>}
        </div >
    )
}
