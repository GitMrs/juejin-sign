const nodeMailer = require("nodemailer");
const axios = require("axios");

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

class Juejin {
  constructor(props) {
    this.time = "10:24:50";
    this.timerTask();
  }
  async init() {
    await this.checkIn();
    await this.draw();
  }
  timerTask() {
    setInterval(() => {
      const date = new Date();
      const _time = `${
        date.getHours() > 9 ? date.getHours() : "0" + date.getHours()
      }:${
        date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()
      }:${date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds()}`;
      if (_time === this.time) {
        this.init();
      } else if (_time === "04:10:22") {
        let minutes = parseInt(Math.random() * 60);
        let seconds = parseInt(Math.random() * 60);
        this.time = `10:${minutes > 9 ? minutes : "0" + minutes}:${
          seconds > 9 ? seconds : "0" + seconds
        }`;
      }
    }, 1000);
  }
  async checkIn() {
    let { error, isCheck } = await this.getTodayCheckStatus();
    if (error) return console.log("查询签到失败");
    if (isCheck) {
      return console.log("今日已经参与签到");
    }
    const { cookie, baseUrl, apiURL } = config;
    let { data } = await axios({
      url: baseUrl + apiURL.checkIn,
      method: "post",
      headers: { Cookie: cookie },
    });
    if (data.err_no) {
      console.log("签到失败");
      await this.sendEmailFormQQ(
        `今日签到：失败(${this.time})`,
        JSON.stringify(data)
      );
    } else {
      console.log(`签到成功！当前积分：${data.data.sum_point}`);
      await this.sendEmailFormQQ(
        `今日签到：成功(${this.time})`,
        JSON.stringify(data)
      );
    }
  }
  async getTodayCheckStatus() {
    const { cookie, baseUrl, apiURL } = config;
    let { data } = await axios({
      url: baseUrl + apiURL.getTodayStatus,
      method: "get",
      headers: { Cookie: cookie },
    });
    console.log(data);
    if (data.err_no) {
      await this.sendEmailFormQQ(
        `今日掘金签到查询：失败(${this.time})`,
        JSON.stringify(data)
      );
    }
    return { error: data.err_no !== 0, isCheck: data.data };
  }
  async draw() {
    let { error, isDraw } = await this.getTodayDrawStatus();
    if (error) return console.log("查询抽奖次数失败");
    if (isDraw) return console.log("今日无免费抽奖次数");
    const { cookie, baseUrl, apiURL } = config;
    let { data } = await axios({
      url: baseUrl + apiURL.drawLottery,
      method: "post",
      headers: { Cookie: cookie },
    });
    if (data.err_no) return console.log("免费抽奖失败");
    console.log(`恭喜抽到：${data.data.lottery_name}`);
  }
  async getTodayDrawStatus() {
    const { cookie, baseUrl, apiURL } = config;
    let data = await axios({
      url: baseUrl + apiURL.getLotterConfig,
      method: "get",
      headers: { Cookie: cookie },
    });
    if (data.err_no) {
      return { error: true, isDraw: false };
    } else {
      return { error: false, isDraw: data.data.data.free_count === 0 };
    }
  }
  async sendEmailFormQQ(subject, html) {
    let cfg = config.email.qq;
    if (!cfg || !cfg.user || !cfg.pass) return;
    const transporter = nodeMailer.createTransport({
      service: "qq",
      auth: { user: cfg.user, pass: cfg.pass },
    });
    transporter.sendMail(
      {
        from: cfg.from,
        to: cfg.to,
        subject: subject,
        html: html,
      },
      (err) => {
        if (err) return console.log(`发送邮件失败： ${err}`, true);
        console.log("发送邮件成功");
      }
    );
  }
}
new Juejin();
