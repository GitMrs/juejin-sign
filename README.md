# 掘金自动签到
## cookie 换成自己的
## email 换成自己的邮箱配置
```
  config = {
  baseUrl: "https://api.juejin.cn",
  apiURL: {
    getTodayStatus: "/growth_api/v1/get_today_status",
    checkIn: "/growth_api/v1/check_in",
    getLotterConfig: "/growth_api/v1/lottery_config/get",
    drawLottery: "/growth_api/v1/lottery/draw",
  },
  cookie: "xxx",
  email: {
    qq: {
      user: "xxxx@qq.com",
      from: "xxxx@qq.com",
      to: "xxxx@qq.com",
      pass: "xxx",
    },
  },
};
```
