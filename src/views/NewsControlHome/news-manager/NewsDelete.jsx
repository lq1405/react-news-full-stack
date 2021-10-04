import { PageHeader, Button, List, notification, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import axios from 'axios';

import useRelease from '../release-manager/release';
const { confirm } = Modal;

export default function NewsDelete() {

  const { getTime } = useRelease();
  // const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newsList, setNewsList] = useState([]);

  const { id } = JSON.parse(localStorage.getItem('token'));
  useEffect(() => {
    axios.get(`/news?authorId=${id}&delete=true`)
      .then(res => {
        console.log(res.data);
        setNewsList(res.data);
      })
  }, [id])

  const handleFind = (item) => {
    console.log(222222, item)
    axios.patch(`/news/${item.id}`, {
      delete: false,
    }).then(res => {
      setNewsList(newsList.filter(data => data.id !== item.id));
      console.log(res.data)
      notification.info({
        message: '新闻已找回',
        description: '您可以再草稿箱中查看',
        duration: 3,
        placement: 'topRight'
      })
    })
  }

  return (
    <div>
      <PageHeader title='删除列表'></PageHeader>
      <List
        size='large'
        style={{ marginLeft: '24px' }}
        dataSource={newsList}
        rowKey='id'
        itemLayout='vertical'
        renderItem={item => (
          <List.Item
            key={item.id}
            extra={
              <div>
                <Button
                  danger
                  type='text'
                  onClick={() => {
                    confirm({
                      title: '是否彻底删除，将无法找回',
                      content: '点击确认将彻底删除该条新闻，再无法找回，请慎重选择！！！',
                      okText: '确认',
                      cancelText: '取消',
                      onOk: () => {
                        console.log(item);
                        axios.delete(`/news/${item.id}`)
                          .then(res => {
                            setNewsList(newsList.filter(data => data.id !== item.id));
                            console.log(res.data);
                          })
                      }
                    })
                  }}
                >彻底删除</Button>
                <Button
                  type='link'
                  onClick={() => handleFind(item)}
                >找回</Button>
              </div>}

          >
            <List.Item.Meta
              title={item.title}
              description={(
                <div>
                  <span>分类：{item.newsType}</span>
                  <span style={{ marginLeft: '20px' }}>删除时间：{getTime(item.deleteTime)}</span>
                </div>
              )}
            />
          </List.Item >
        )
        }
      >
      </List >
    </div >
  )
}
