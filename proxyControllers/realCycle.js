//실제 생리 주기 관련 정보 처리
const { User } = require("../models");

const json = require("./responseController");

let meanCycle = 0;

//평균 주기 물어볼 경우
const askMeanCycle = async (req, res, next) => {
  console.log(req.body);
  console.log(req.body.action.parameters.user_ID.value);
  try {
    //조회
    const exUser = await User.findOne({
      attributes: ["meanCycle"],
      where: { id: req.body.action.parameters.user_ID.value },
    });
    if (!exUser) {
      meanCycle = "아이디 없음";
    } else if (exUser.meanCycle === null) {
      meanCycle = "널값";
    } else if (exUser) {
      meanCycle = exUser.meanCycle;
    }
    //처리 후 responseController형식에 맞춰줘야 함. nugu 홈페이지 responseSample 형식으로x
    const resObj = json.resSample();
    resObj.version = req.body.version;
    resObj.output.meanCycle = meanCycle;
    res.json(resObj);
    res.end();
    return;
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

module.exports = {
  askMeanCycle,
};
