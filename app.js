const http = require('http');
const {parse} = require("url");
const port = process.env.PORT || 9000;
const { JSDOM } = require("jsdom");

const { window } = new JSDOM();
global.window = window;
global.document = window.document;
global.navigator = window.navigator;
global.navigator.userAgent = window.navigator.userAgent;
global.navigator.language = window.navigator.language;
const echarts = require('echarts');
const renderChart = (res,data)=>{
    let json = {};
    try{
         json = JSON.parse(data);
    }catch (e) {
        try {
            const fn = new Function(`return ${data}`);
            json = fn();
        } catch (e) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('JSON Error:'+ e.toString());
            return ;
        }
    }
    if(!json){
        return ;
    }

    let options = json.options || {};
    let theme = json.theme || '';
    let width = json.width || 600;
    let height = json.height || 400;
    let output = json.output || 'base64';

    let  svgStr = '';

   try{
       const chart = echarts.init(null, theme, {
           renderer: 'svg', // 必须使用 SVG 模式
           ssr: true, // 开启 SSR
           width: width, // 需要指明高和宽
           height: height
       });

// 像正常使用一样 setOption
       chart.setOption(options);
       svgStr = chart.renderToSVGString();
       chart.dispose();
   }catch (e) {
       res.writeHead(500, {'Content-Type': 'text/plain'});
       res.end('Echarts Error:'+ e.toString());
       return ;
   }
    res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
    res.end(svgStr);
}
const requestHandler = (req, res) => {
    let body = '';
    if (req.method === 'GET') {
        const parsedUrl = parse(req.url, true); // true 参数确保 query 被解析为对象
        body = parsedUrl.query.data; // 获取 query 中的 data 参数
        if(!body){
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Param Error: No param `data`');
        }
        renderChart(res,body)
    } else if (req.method === 'POST') {
        body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // 将数据块转换为字符串
        });
        req.on('end', () => {
            renderChart(res,body)
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(`POST request received with body: ${body}`);
        });
    } else {
        res.writeHead(405);
        res.end(`${req.method} is not allowed on this server`);
    }
};

const app = http.createServer(requestHandler);

app.listen(port, err => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});
