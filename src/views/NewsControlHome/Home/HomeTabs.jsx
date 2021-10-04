import { Tabs } from 'antd'
import React from 'react'
import HomeList from './HomeList';
const { TabPane } = Tabs;

export default function HomeTabs(props) {
  return (
    <div>
      <Tabs
        size="small"
        defaultActiveKey="1"
        type='card'>
        <TabPane tab={`日${props.title}`} key="1">
          <HomeList
            dataSource={props.dayDataSource}
            str={props.str}
          ></HomeList>
        </TabPane>
        <TabPane tab={`周${props.title}`} key="2">
          <HomeList
            dataSource={props.weekDDataSource}
            str={props.str}
          ></HomeList>
        </TabPane>
        <TabPane tab={`年${props.title}`} key="3">
          <HomeList
            dataSource={props.weekDDataSource}
            str={props.str}
          ></HomeList>
        </TabPane>
      </Tabs>
    </div>
  )
}
