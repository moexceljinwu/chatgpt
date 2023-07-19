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
export function LoginUp() {
  const [image, setImage] = useState("");
  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: "",
    code: "",
    key: "",
  });
  useEffect(() => {
    isLogin();
  }, []);
  // const [currentInfo,setCurrentInfo] = useState("获取验证码")
  // const [isDisabled,setIsDisabled] = useState(false)

  // useEffect(() => {
  //   getCode();
  // }, []);

  // function getCode() {
  //   axios.get("https://test.chatuai.cn/common/captcha").then((res) => {
  //     console.log(res.data.data);
  //     loginInfo.key = res.data.data.key;
  //     setImage(res.data.data.image);
  //   });
  // }
  // function getCode(){
  //   let second = 5;
  //   setIsDisabled(true)
  //   setCurrentInfo(`正在获取...`)
  //   let timer = setInterval(()=>{
  //     second = second - 1
  //     setCurrentInfo(`${second}秒后重新获取`)
  //     if(second<=0){
  //       setIsDisabled(false)
  //       setCurrentInfo(`重新获取`)
  //       clearInterval(timer)
  //     }
  //   },1000)
  // }
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

  async function login() {
    console.log(loginInfo);
    await axios({
      method: "post",
      url: "https://test.chatuai.cn/common/login",
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

  function goLogin() {
    navigate(Path.Login);
  }

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement>,
    inputName: string,
  ) {
    setLoginInfo({ ...loginInfo, [inputName]: event.target.value });
  }

  return (
    <div className="box">
      <div className="login-box">
        <div className="info">
          <input
            type="text"
            placeholder="请输入您的账号"
            value={loginInfo.username}
            onChange={(e) => handleInputChange(e, "username")}
          />{" "}
          <br />
          <input
            type="password"
            placeholder="请输入您的密码"
            value={loginInfo.password}
            onChange={(e) => handleInputChange(e, "password")}
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
            <span style={{ cursor: "pointer" }} onClick={goLogin}>
              手机验证码登录
            </span>
            {/* <span>忘记密码？</span> */}
          </div>
          <div style={{ fontSize: "12px", marginTop: "20px" }}>
            登录问题联系vx：chatuai
          </div>
        </div>
      </div>
    </div>
  );
}
