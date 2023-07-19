import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import { Path } from "../constant";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
export function ChangePh() {
  const [image, setImage] = useState("");
  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState({
    telephone: "",
    code: "",
    key: "",
  });
  const [currentInfo, setCurrentInfo] = useState("获取验证码");
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    isTiming();
  }, []);

  function calTime(starTime: string, currentTime: number) {
    const starTimeInt = parseInt(starTime);
    console.log("starTime", starTimeInt);
    console.log("currentTime", currentTime);

    return Math.floor((currentTime - starTimeInt) / 1000);
  }

  function isTiming() {
    if (localStorage.getItem("starChangeTime") == null) {
      return;
    }
    let time = calTime(
      localStorage.getItem("starChangeTime")!,
      new Date().getTime(),
    );
    console.log("time", time);

    if (time < 60) {
      setIsDisabled(true);
      let t = 60 - time;
      let timer = setInterval(() => {
        t = t - 1;
        setCurrentInfo(`${t}秒后重新获取`);
        if (t <= 0) {
          setIsDisabled(false);
          setCurrentInfo(`重新获取`);
          clearInterval(timer);
        }
      }, 1000);
    }
  }

  function getCode() {
    let second = 60;
    setIsDisabled(true);
    setCurrentInfo(`正在获取...`);
    axios({
      url: "https://test.chatuai.cn/user/sendCodeChangePh",
      method: "get",
      withCredentials: true,
      params: {
        telephone: loginInfo.telephone,
      },
    }).then((res) => {
      localStorage.setItem("starChangeTime", new Date().getTime().toString());
      if (res.data.code == 200) {
        loginInfo.key = res.data.data;
        let timer = setInterval(() => {
          second = second - 1;
          setCurrentInfo(`${second}秒后重新获取`);
          if (second <= 0) {
            setIsDisabled(false);
            setCurrentInfo(`重新获取`);
            clearInterval(timer);
          }
        }, 1000);
      } else {
        setIsDisabled(false);
        setCurrentInfo(`获取验证码`);
        alert(res.data.msg);
      }
    });
  }

  function goLoginup() {
    navigate(Path.LoginUP);
  }

  async function login() {
    console.log(loginInfo);
    await axios({
      method: "post",
      url: "https://test.chatuai.cn/user/changeph",
      data: loginInfo,
      withCredentials: true,
    }).then((res) => {
      console.log(res);

      if (res.data.code == 200) {
        navigate(Path.Settings);
        localStorage.setItem("userInfo", JSON.stringify(res.data.data));
      } else {
        alert(res.data.msg);
      }
    });
  }

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement>,
    inputName: string,
  ) {
    setLoginInfo({ ...loginInfo, [inputName]: event.target.value });
    console.log(loginInfo);
  }

  return (
    <div className="box">
      <div className="window-header">
        <div className="window-header-title">
          <div className="window-header-main-title">更换手机号</div>
          <div className="window-header-sub-title">输入新的手机号</div>
        </div>
      </div>
      <div className="login-box">
        <div className="info">
          <input
            type="text"
            placeholder="请输入您的新手机号"
            value={loginInfo.telephone}
            onChange={(e) => handleInputChange(e, "telephone")}
            className="username"
          />{" "}
          <br />
          <input
            type="text"
            placeholder="请输入验证码"
            value={loginInfo.code}
            onChange={(e) => handleInputChange(e, "code")}
            className="password"
          />{" "}
          <button className="codeBtn" onClick={getCode} disabled={isDisabled}>
            {currentInfo}
          </button>
          <br />
          {/* <div
            className="codeBox"
            style={{ display: "flex", alignContent: "center" }}
          >
            <input
              type="text"
              style={{
                width: "130px",
                display: "flex",
                alignContent: "center",
              }}
              placeholder="请输入验证码"
              value={loginInfo.code}
              onChange={(e) => handleInputChange(e, "code")}
            />
            <img
              src={image}
              alt=""
              style={{ width: "110px", marginLeft: "10px", marginTop: "15px" }}
              onClick={getCode}
              className={"codeImg"}
            />
          </div> */}
          <div className="btn">
            <button onClick={login} style={{ width: "250px" }}>
              确认
            </button>
            {/* <Link to={Path.Register}>
              <button>注册</button>
            </Link> */}
          </div>
          <div
            style={{
              fontSize: "12px",
              marginTop: "20px",
              textDecoration: "underline",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
