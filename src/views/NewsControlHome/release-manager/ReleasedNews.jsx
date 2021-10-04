import { PageHeader, Button, List, Tooltip } from 'antd'
import React, { useState } from 'react'
import { ClockCircleFilled, EyeFilled, LikeOutlined } from '@ant-design/icons';
import useRelease from './release';
import axios from 'axios';


export default function ReleasedNews() {
  const { dataSource, getTime, handleOffline } = useRelease(2);

  // setNewsList();

  const node = (icon, text, str) => (
    <Tooltip title={str}>
      {icon}
      {text}
    </Tooltip>
  )

  return (
    <div>
      <PageHeader title='已发布'></PageHeader>
      <List
        size='large'
        dataSource={dataSource}
        rowKey='id'
        itemLayout='vertical'
        pagination={{
          pageSize: 10,
          showQuickJumper: true
        }}
        renderItem={item => (
          <List.Item
            key={item.id}
            actions={
              [node(<EyeFilled style={{ marginRight: '4px' }} />, item.view, '浏览数'),
              node(< LikeOutlined style={{ marginRight: '4px' }} />, item.star, '点赞'),
              node(<ClockCircleFilled style={{ marginRight: '4px' }} />, getTime(item.releaseTime), '发布时间'),
              node(null, item.newsType, '分类')
              ]
            }
            extra={<Button
              danger
              type='text'
              onClick={() => handleOffline(item)}
            >下线</Button>}
          >
            <List.Item.Meta
              style={{ width: '70%', overflow: 'hidden' }}
              title={<a href={`#/news-manager/preview/${item.id}`}>{item.title}</a>}
            />
          </List.Item >
        )
        }
      >
      </List >
    </div >
  )
}
