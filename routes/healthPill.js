const schedule = require("node-schedule");
const express = require("express");
const { isLoggedIn } = require("./middlewares");
const { Control, Date } = require("../models");
//const cron = require("node-cron");
const router = express.Router();
const moment = require("moment");
const rule = new schedule.RecurrenceRule();
const j = schedule.scheduleJob(rule, function () {});

require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

    router.post("/api/main/control", async (req, res) => {
      const {controlStart, controlEnd, controlHour, controlMinute} = req.body;
      try {
        const {
          controlStart, //controlStart 정하고 controlEnd가 되면 취소돼야함. controlEnd+1=j.cancel
          controlEnd,
          controlHour,
        } = req.body;
        try {
          const Control = await Control.findAll({});
          const controlTime = controlHour.split(':');
          rule.hour = controlTime[0];
          rule.minute = controlTime[1];
          const j = schedule.scheduleJob(rule, function () {
            alert('성공!') // alert 말고
          });
          return res.status(201).json({completed: true});
          return res.send("라우터 연결 됨");
        } catch (error) {
          console.error(error);
          return next(error);
        }
      } catch (error) {
        console.error(error);
        return next(error);
      }
    });

/*
const alarm = cron.schedule('0 controlTime[1] controlTime[0] *%/24 * *', () => {
    console.log('알람 울리기');
    alert('성공');
});
If(date === controlStart){
    alarm.start();
    } else if (date === controlEnd){
        alarm.destroy(); }

If (controlEnd === null){
    set controlEnd = controlStart+180
    }else {
        controlEnd: controlEnd}
const i = new Date();
for(i=controlStart; i<= controlEnd; i++){
    i가 start 이상 end 이하일 때 계속 울리기

    const alarm = cron.schedule('0 controlTime[1] controlTime[0] *%/24 * *', () => {
    console.log('알람 울리기');
    alert('성공');
}

 */

router.get("/api/main/control", isLoggedIn, async (req, res) => {
  //날짜를 어떻게 받아올건지? 주소로?? 아님 req.body로?
  const date = req.body.date;
  try {
    const exDate = await Date.findOne({
      attributes: ["isControl"],
      where: { date: date, userId: req.user.id },
    });
    if (exDate.isControl) {
      res.send("오늘 피임약 복용 완료");
    } else {
      res.send("오늘 피임약 복용 전");
    }
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
