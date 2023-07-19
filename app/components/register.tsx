import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import {
  MAX_SIDEBAR_WIDTH,
  MIN_SIDEBAR_WIDTH,
  NARROW_SIDEBAR_WIDTH,
  Path,
  REPO_URL,
} from "../constant";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
export function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const goLogin = () => {
    navigate(Path.Settings);
  };

  const [registerInfo, setRegisterInfo] = useState({
    username: "",
    password: "",
    telephone: "",
    recommender: "",
    code: "",
    key: "",
  });
  const [currentInfo, setCurrentInfo] = useState("获取验证码");
  const [isDisabled, setIsDisabled] = useState(false);

  function register() {
    axios({
      method: "post",
      url: "https://test.chatuai.cn/common/register",
      data: registerInfo,
      withCredentials: true,
    }).then((res) => {
      console.log(res);
      if (res.data.code == 200) {
        localStorage.setItem("userInfo", JSON.stringify(res.data.data));
        alert("注册成功");
        goLogin();
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

  useEffect(() => {
    // getCode();
    getInviteCode();
  }, []);

  function getInviteCode() {
    const searchParams = new URLSearchParams(location.search);
    const value = searchParams.get("inviteCode");
    if (value != null) {
      setRegisterInfo({ ...registerInfo, recommender: value });
    }
  }

  useEffect(() => {
    isLogin();
    isTiming();
  }, []);

  function isTiming() {
    if (localStorage.getItem("starRegisterTime") == null) {
      return;
    }
    let time = calTime(
      localStorage.getItem("starRegisterTime")!,
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
      // setCurrentInfo(`${time}秒后重新获取`)
    }
  }

  function calTime(starTime: string, currentTime: number) {
    const starTimeInt = parseInt(starTime);
    console.log("starTime", starTimeInt);
    console.log("currentTime", currentTime);

    return Math.floor((currentTime - starTimeInt) / 1000);
  }

  // function getCode() {
  //   axios.get("https://test.chatuai.cn/common/captcha").then((res) => {
  //     registerInfo.key = res.data.data.key;
  //     setImage(res.data.data.image);
  //   });
  // }

  function getCode() {
    let second = 60;
    setIsDisabled(true);
    setCurrentInfo(`正在获取...`);
    axios({
      url: "https://test.chatuai.cn/common/sendCode",
      method: "get",
      withCredentials: true,
      params: {
        telephone: registerInfo.telephone,
        type: "register",
      },
    }).then((res) => {
      console.log(res.data);
      if (res.data.code == 200) {
        localStorage.setItem(
          "starRegisterTime",
          new Date().getTime().toString(),
        );
        registerInfo.key = res.data.data;
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

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement>,
    inputName: string,
  ) {
    setRegisterInfo({ ...registerInfo, [inputName]: event.target.value });
  }

  return (
    <div className="box">
      <div className="login-box">
        <div className="info">
          <input
            type="text"
            placeholder="请输入您的账号"
            value={registerInfo.username}
            onChange={(e) => handleInputChange(e, "username")}
            // className="username"
          />{" "}
          <br />
          <input
            type="password"
            placeholder="请输入您的密码"
            value={registerInfo.password}
            onChange={(e) => handleInputChange(e, "password")}
          />{" "}
          <br />
          <input
            type="text"
            placeholder="请输入您的手机号"
            value={registerInfo.telephone}
            onChange={(e) => handleInputChange(e, "telephone")}
            // className="username"
          />{" "}
          <br />
          <input
            type="password"
            placeholder="请输入验证码"
            value={registerInfo.code}
            onChange={(e) => handleInputChange(e, "code")}
            className="password"
          />{" "}
          <button className="codeBtn" onClick={getCode} disabled={isDisabled}>
            {currentInfo}
          </button>
          <br />
          <input
            type="text"
            placeholder="推荐码（如果无，请联系客服）"
            value={registerInfo.recommender}
            onChange={(e) => handleInputChange(e, "recommender")}
          />{" "}
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
              value={registerInfo.code}
              onChange={(e) => handleInputChange(e, "code")}
            />
            <img
              src={image}
              alt=""
              style={{ width: "110px", marginLeft: "10px", marginTop: "15px" }}
              className="codeImg"
              onClick={getCode}
            />
          </div> */}
          <div className="btn">
            <button style={{ width: "250px" }} onClick={register}>
              注册
            </button>
          </div>
          <div className="footer">
            <span
              style={{ fontSize: "14px", cursor: "pointer" }}
              onClick={goLogin}
            >
              已有账号？点击返回登录
            </span>
          </div>
          <div style={{ fontSize: "12px", marginTop: "20px" }}>
            注册问题联系vx：chatuai
          </div>
        </div>
      </div>
    </div>
  );
}
