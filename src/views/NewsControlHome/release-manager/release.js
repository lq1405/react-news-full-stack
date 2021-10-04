import {
  useState,
  useEffect
} from 'react';
import axios from 'axios';
import moment from 'moment'
import {
  notification
} from 'antd';



const useRelease = (num) => {
  const [dataSource, setDataSource] = useState([]);
  const {
    id
  } = JSON.parse(localStorage.getItem('token'));
  useEffect(() => {
    axios.get(`/news?authorId=${id}&releaseState=${num}&&delete=false`)
      .then(res => {
        console.log(res.data)
        setDataSource(res.data.sort((a, b) => b.releaseTime - a.releaseTime))
      })
  }, [id, num])

  const getTime = (time) => {
    if (moment(time).isAfter(moment(time).year())) {
      return moment(time).format('MM-DD')
    }
    return moment(time).format('YY-MM-DD')
  };

  const handleOffline = (item) => {
    console.log(1111111, item.id)
    axios.patch(`/news/${item.id}`, {
      releaseState: 3,
    }).then(res => {
      setDataSource(dataSource.filter(data => data.id !== item.id));
      notification.info({
        message: '新闻已下线',
        description: '您可以再已下线中查看',
        duration: 3,
        placement: 'topRight',
        offlineTime: Date.now()
      })
    })
  }

  const handleRelease = (item) => {
    console.log(1111111, item);

    axios.patch(`/news/${item.id}`, {
      releaseState: 2,
      releaseTime: Date.now()
    }).then(res => {
      console.log(res.data)
      setDataSource(dataSource.filter(data => data.id !== item.id));
      notification.info({
        message: '新闻已发布',
        description: '您可以再已发布中查看',
        duration: 3,
        placement: 'topRight'
      })
    })
  }

  const handleDelete = (item) => {
    axios.patch(`/news/${item.id}`, {
      delete: true,
      examineState: 0,
      releaseState: 0,
      deleteTime: Date.now()
    }).then(res => {
      console.log(res.data)
      setDataSource(dataSource.filter(data => data.id !== item.id));
      notification.info({
        message: '新闻已删除',
        description: '您可以再已删除中查看',
        duration: 3,
        placement: 'topRight'
      })
    })
  }


  return {
    dataSource,
    handleOffline,
    getTime,
    handleRelease,
    handleDelete
  }
}

export default useRelease;