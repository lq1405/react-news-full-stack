import { Card, Col, Modal, Row } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { AreaChartOutlined } from '@ant-design/icons'
import axios from 'axios';
import HomeTabs from './HomeTabs';
import * as echarts from 'echarts'
// const { Meta } = Card;


function Home(props) {

    const barRef = useRef();
    const pieRef = useRef();
    const [pieChart, setPieChart] = useState(null);
    const [barChart, setBarChart] = useState(null);
    const [playNumList, setPlayNumList] = useState([]);
    const [starNumList, setStarNumList] = useState([]);
    const [showClickNumModal, setShowClickNumModal] = useState(false);
    const [clickData, setClickData] = useState([]);
    const [starData, setStarData] = useState([]);

    useEffect(() => {

        axios.get('/news?releaseState=2')
            .then(res => {
                setPlayNumList(res.data.sort((a, b) => b.view - a.view).slice(0, 6));
                setStarNumList(res.data.sort((a, b) => b.star - a.star).slice(0, 6));
            })

        axios.get('/newsTypes?_embed=news&releaseState=2&delete&=false')
            .then(async res => {
                setClickData(getData(res, "view")[0]);
                setStarData(getData(res, "star")[0]);


            })

    }, [])

    const getData = (res, str) => {
        const data = [];
        data.push(res.data.map(item => {
            let i = 0;

            item.news.filter(data => data.releaseState === 2).forEach(data => {
                i += data[str];
            })

            return { name: item.typeName, value: i };

        }))
        return data;
    }

    const chartBar = (data) => {

        const data1 = [];
        const data2 = [];
        data1.push(data.map(data => data.name))
        data2.push(data.map(data => data.value))
        var myChart;
        if (!barChart) {
            myChart = echarts.init(barRef.current);
            setBarChart(myChart);
        } else {
            myChart = barChart;
        }

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '点击量'
            },
            tooltip: {},
            legend: {
                data: ['点击量']
            },
            xAxis: {
                data: data1[0]
            },
            yAxis: {},
            series: [
                {
                    name: '点击量',
                    type: 'bar',
                    data: data2[0]
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }

    const chartPie = (data) => {

        // console.log(data);
        var myChart;
        if (!pieChart) {
            myChart = echarts.init(pieRef.current);
            setPieChart(myChart);
        } else {
            myChart = pieChart;
        }
        var option;

        option = {
            title: {
                text: '新闻分类的点击量',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
            },
            series: [
                {
                    type: 'pie',
                    radius: '50%',
                    data: data,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        option && myChart.setOption(option);

    }

    return (
        <div>
            <Row gutter={16}>
                <Col span={8}>
                    <Card
                        style={{ margin: '0 24px', padding: "0px" }}
                        title={<span>点击量
                            <AreaChartOutlined
                                style={{ marginLeft: '10px' }}
                                onClick={async () => {
                                    await setShowClickNumModal(true)
                                    chartBar(clickData);
                                    chartPie(clickData);
                                }} /> </span>}
                    >
                        <HomeTabs
                            dayDataSource={playNumList}
                            weekDDataSource={playNumList}
                            yearDataSource={playNumList}
                            str="view"
                            title="点击量"
                        ></HomeTabs>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title={<span>点赞数
                        <AreaChartOutlined
                            style={{ marginLeft: '10px' }}
                            onClick={async () => {
                                await setShowClickNumModal(true)
                                chartBar(starData);
                                chartPie(starData);
                            }} /> </span>}
                    >
                        <HomeTabs
                            dayDataSource={starNumList}
                            weekDDataSource={starNumList}
                            yearDataSource={starNumList}
                            str="star"
                            title="点赞数"
                        ></HomeTabs>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title={<span>评论数
                        <AreaChartOutlined
                            style={{ marginLeft: '10px' }}
                            onClick={async () => {
                                await setShowClickNumModal(true)
                                chartBar(starData);
                                chartPie(starData);
                            }} /> </span>}
                    >
                        <HomeTabs
                            dayDataSource={starNumList}
                            weekDDataSource={starNumList}
                            yearDataSource={starNumList}
                            str="star"
                            title="评论数"
                        ></HomeTabs>
                    </Card>
                </Col>
            </Row>
            <Modal
                width="70%"
                onCancel={() => {
                    setShowClickNumModal(false);
                }}
                onOk={() => {
                    setShowClickNumModal(false);
                }}
                okText="确认" cancelText="取消"
                visible={showClickNumModal}>
                <div
                    ref={barRef}
                    style={{
                        display: 'inline-block',
                        width: '40%',
                        height: '400px'
                    }}
                ></div>
                <div
                    ref={pieRef}
                    style={{
                        marginLeft: '10%',
                        display: 'inline-block',
                        width: '40%',
                        height: '400px'
                    }}
                ></div>

            </Modal>
        </div >
    );
}


export default Home;