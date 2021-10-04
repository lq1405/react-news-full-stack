import { List } from 'antd'
import React from 'react'

export default function HomeList(props) {
  return (
    <List
      dataSource={props.dataSource}
      renderItem={(item) => <List.Item
        style={{ height: '50px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
      >
        <List.Item.Meta
          title={<div
            style={{
              width: '85%',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis'
            }}>
            {<a
              href={`#/news-manager/preview/${item.id}`}>
              {item.title}
            </a>}
          </div>}
        />
        <div>{item[props.str]}</div>
      </List.Item>}
    >
    </List>

  )
}


