import { Button, List, PageHeader } from 'antd';
import React from 'react'
import useRelease from './release'

export default function ReleaseOffline() {

  const { dataSource, handleDelete, handleRelease, getTime } = useRelease(3);
  return (
    <div>
      <PageHeader title="已下线"></PageHeader>
      <List
        style={{ marginLeft: '24px' }}
        dataSource={dataSource}
        pagination={{
          pageSize: 5,
          showQuickJumper: true
        }}
        renderItem={item => (
          <List.Item
            actions={[
              <Button
                danger type='text'
                style={{ marginRight: '20px' }}
                onClick={() => handleDelete(item)}
              >删除</Button>,
              <Button
                type='link'
                style={{ marginRight: '20px' }}
                onClick={() => handleRelease(item)}
              >发布</Button>
            ]}
            
          >
            <List.Item.Meta
              title={item.title}
              description={(
                <div>
                  <span>分类：{item.newsType}</span>
                  <span style={{ marginLeft: '20px' }}>下线时间：{getTime(item.offlineTime)}</span>
                </div>
              )}
            />
          </List.Item>)
        }
      >
      </List >
    </div>
  )
}
