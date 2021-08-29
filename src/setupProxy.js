const {
    createProxyMiddleware
} = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        '/splcloud',
        createProxyMiddleware({
            target: 'https://c.y.qq.com',
            changeOrigin: true,
        })
    );
};