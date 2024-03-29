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
export function Login() {
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
    isLogin();
    isTiming();
  }, []);

  function calTime(starTime: string, currentTime: number) {
    const starTimeInt = parseInt(starTime);
    console.log("starTime", starTimeInt);
    console.log("currentTime", currentTime);

    return Math.floor((currentTime - starTimeInt) / 1000);
  }

  function isTiming() {
    if (localStorage.getItem("starTime") == null) {
      return;
    }
    let time = calTime(localStorage.getItem("starTime")!, new Date().getTime());
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
      // setCurrentInfo(`${time}秒后重新获取`)
    }
  }

  function getCode() {
    let second = 60;
    setIsDisabled(true);
    setCurrentInfo(`正在获取...`);
    axios({
      url: "https://test.chatuai.cn/common/sendCode",
      method: "get",
      withCredentials: true,
      params: {
        telephone: loginInfo.telephone,
        type: "login",
      },
    }).then((res) => {
      if (res.data.code == 200) {
        localStorage.setItem("starTime", new Date().getTime().toString());
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
      url: "https://test.chatuai.cn/common/loginph",
      data: loginInfo,
      withCredentials: true,
    }).then((res) => {
      console.log(res);

      if (res.data.code == 200) {
        navigate(Path.Home);
        localStorage.setItem("userInfo", JSON.stringify(res.data.data));
      } else {
        alert(res.data.msg);
      }
    });
  }

  function isLogin() {
    axios({
      url: "https://test.chatuai.cn/user/checklogin",
      method: "get",
      withCredentials: true,
    }).then((res) => {
      if (res.data.code == 200) {
        navigate(Path.Home);
      } else {
      }
    });
  }

  function goadmin() {
    alert("请联系管理员进行申诉");
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
      <div className="login-box">
        <div className="info">
          <input
            type="text"
            placeholder="请输入您的手机号"
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
            <button onClick={login}>登录</button>
            <Link to={Path.Register}>
              <button>注册</button>
            </Link>
          </div>
          <div
            style={{
              fontSize: "12px",
              marginTop: "20px",
              textDecoration: "underline",
            }}
          >
            <span
              style={{ marginRight: "60px", cursor: "pointer" }}
              onClick={goLoginup}
            >
              账号密码登录
            </span>

            <span style={{ cursor: "pointer" }} onClick={goadmin}>
              手机号已不再使用？
            </span>
          </div>
          <div style={{ fontSize: "12px", marginTop: "20px" }}>
            登录问题联系vx：chatuai
          </div>
        </div>
      </div>
    </div>
  );
}
