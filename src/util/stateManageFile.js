export const examineStateList = [{
        state: 0,
        value: '未审核',
        color: 'warning'
    }, {
        state: 1,
        value: "审核中",
        color: "processing",

    }, {
        state: 2,
        value: "已通过",
        color: "success",

    }, {
        state: 3,
        value: "未通过",
        color: "error",
    }

]

export const releaseStateList = [{
        state: 0,
        value: '-',
        color: ''
    },
    {
        state: 1,
        value: '待发布',
        color: 'warning'
    },
    {
        state: 2,
        value: '已发布',
        color: 'success'
    },
    {
        state: 3,
        value: '已下线',
        color: 'error'
    },
]