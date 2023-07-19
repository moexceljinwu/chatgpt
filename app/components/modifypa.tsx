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
export function ModifyPa() {
  const [password, setpassword] = useState("");
  const [repassword, setrepassword] = useState("");

  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState({
    telephone: "",
    code: "",
    key: "",
  });

  async function login() {
    console.log(password);
    await axios({
      method: "post",
      url: "https://test.chatuai.cn/user/changepa",
      params: {
        password,
        repassword,
      },
      withCredentials: true,
    }).then((res) => {
      if (res.data.code == 200) {
        alert("修改成功");
        navigate(Path.Settings);
      } else {
        alert(res.data.msg);
      }
    });
  }

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement>,
    inputName: string,
  ) {
    // setLoginInfo({ ...loginInfo, [inputName]: event.target.value });
    setpassword(event.target.value);
    // console.log(loginInfo);
  }

  function handleInputChangeRe(
    event: ChangeEvent<HTMLInputElement>,
    inputName: string,
  ) {
    setrepassword(event.target.value);
  }

  return (
    <div className="box">
      <div className="window-header">
        <div className="window-header-title">
          <div className="window-header-main-title">修改密码</div>
          <div className="window-header-sub-title">输入新密码</div>
        </div>
      </div>

      <div className="login-box">
        <div className="info">
          <input
            type="password"
            placeholder="请输入新密码"
            value={password}
            onChange={(e) => handleInputChange(e, "password")}
            className="username"
          />
          <br />
          <input
            type="password"
            placeholder="请再次输入新密码"
            value={repassword}
            onChange={(e) => handleInputChangeRe(e, "repassword")}
            className="username"
          />
          <br />
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
