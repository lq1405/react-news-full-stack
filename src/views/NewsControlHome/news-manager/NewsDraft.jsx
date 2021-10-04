import NewsEditForm from '../../../components/news-manager/NewsEditForm';
import React, { useEffect, useState } from 'react'
import { Button, Table, Modal, Form, Tooltip, notification } from 'antd'
import axios from 'axios';
import {
  DeleteOutlined, ExclamationCircleOutlined,
  FormOutlined, UploadOutlined
} from '@ant-design/icons';

const { confirm } = Modal;


export default function NewsDraft(props) {

  const [dataSource, setDataSource] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentId, setCurrentId] = useState(0);
  const [newsTypeList, setNewsTypeList] = useState([]);
  const [title, setTitle] = useState('');
  const [newsType, setNewsType] = useState('');
  const [content, setContent] = useState('');

  const [form] = Form.useForm();


  const { username } = JSON.parse(localStorage.getItem('token'));

  useEffect(() => {
    axios.get(`/news?author=${username}&examineState=0`)
      .then(res => setDataSource(res.data))
    axios.get('/newsTypes').then(res => {
      // console.log(res.data)
      setNewsTypeList(res.data)
    });
  }, [username])


  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 150,
      render: id => { return <b>{id}</b> }
    },
    {
      title: '新闻标题', dataIndex: "title",
      width: '40%',
      ellipsis: true,
      render: (title, item) =>
        <a href={`#/news-manager/preview/${item.id}`}>{title}</a>
    },
    { title: '作者', dataIndex: 'author' },
    { title: '新闻分类', dataIndex: 'newsType' },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Tooltip placement="top" title='删除'>
            <Button
              style={{ marginRight: '10px' }}
              danger shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => deleteConfirm(item)}
            ></Button>
          </Tooltip>
          <Tooltip placement="top" title='编辑'>
            <Button
              style={{ marginRight: '10px' }}
              type='primary' shape="circle"
              icon={<FormOutlined />}
              onClick={() => {
                setShowEditModal(true);
                form.setFieldsValue(item);
                setContent(item.content);
                setCurrentId(item.id);
                setTitle(item.title);
                setNewsType(item.newsType);
              }}
            ></Button>
          </Tooltip>
          <Tooltip placement='top' title="提交审核">
            <Button
              type='primary' shape="circle"
              icon={<UploadOutlined />}
              onClick={() => {
                confirm({
                  title: '提交审核',
                  okText: '确认',
                  cancelText: '取消',
                  content: `是否确认提价审核：${item.title}`,
                  onOk: () => {
                    axios.patch(`/news/${item.id}`, {
                      examineState: 1
                    }).then(res => {
                      setDataSource(dataSource.filter(data => data.id !== item.id));
                      notification.info({
                        message: '通知',
                        description: "您可以到 '审核管理' 中的 '待审核' 查看新闻的审核情况！",
                        placement: 'topRight',
                        // 通知自动关闭的时间
                        duration: 3,
                      })

                    })
                  }
                })
              }}
            ></Button>
          </Tooltip>
        </div>
      }
    }
  ]

  const deleteConfirm = (item) => {
    console.log(item);
    confirm({
      title: "您确定删除吗？",
      icon: <ExclamationCircleOutlined />,
      content: "当您点击 确认 的时候，该 新闻草稿 将被删除！",
      okText: '确认', cancelText: '取消',
      onOk() {
        console.log(item.id)
        setDataSource(dataSource.filter(data => data.id !== item.id));
        axios.delete(`/news/${item.id}`);
      }
    })
  }

  function getTitle(value) {
    setTitle(value);
  }
  function getContent(value) {
    setContent(value);
  }
  function getNewsType(value) {
    setNewsType(value);
  }
  return (
    <div>
      <Modal visible={showEditModal}
        title="修改新闻"
        width="60%"
        okText="确认" cancelText="取消"
        onCancel={() => {
          form.resetFields();
          setShowEditModal(false)
        }}
        onOk={() => {
          setShowEditModal(false);
          form.resetFields();
          console.log(1111, dataSource.filter(item => item.id === currentId)[0].title);
          setDataSource(dataSource.map(item => {
            if (item.id === currentId) {
              return { ...item, title: title, content: content, newsType: newsType }
            }
            return item;
          }))

          axios.patch(`/news/${currentId}`, {
            title,
            newsType,
            content
          })
        }}

      >
        <NewsEditForm
          form={form}
          newsTypeList={newsTypeList}
          getTitle={(value) => getTitle(value)}
          getNewsType={(value) => getNewsType(value)}
          getContent={(value) => getContent(value)}
          content={content}
        ></NewsEditForm>
      </Modal>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey='id'
      ></Table>
    </div>
  )
}
