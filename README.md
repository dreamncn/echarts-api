# ECharts-API

借助[vercel](https://vercel.app)发布Echarts服务端API

## Usage

### GET请求
```
GET https://your.domain/?data={options:{}}
```
### POST请求

```
POST https://your.domain/

{options:{}}
```
### 参数
> 支持JS对象， `options`、`theme`参数请参考echarts官网
```json
{
  "theme": "dark",
  "width": 600,
  "height": 400,
  "options": {
    
  }
}
```