import "./recommender.scss";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { userAgent } from "next/server";
import { showToast } from "../components/ui-lib";
import { Path, UPDATE_URL } from "../constant";
export function Recommender() {
  const navigate = useNavigate();
  useEffect(() => {
    getPayPerson();
  }, []);

  const [recommenderInfo, setRecommenderInfo] = useState({
    personTotal: 0,
    payPerson: 0,
    orderTotal: 0,
    moneyTotal: 0,
  });

  function getPayPerson() {
    axios({
      method: "get",
      url: "https://test.chatuai.cn/recommender/getRecom",
      withCredentials: true,
      params: {
        recommender: JSON.parse(localStorage.getItem("userInfo")!).username,
      },
    }).then((res) => {
      if (res.data.code == 200) {
        setRecommenderInfo(res.data.data);
      } else {
        alert("请联系管理员获得推荐人资格");
        navigate(Path.Settings);
      }
    });
  }

  return (
    <div className="box">
      <div className="info">
        <div className="wrap">
          <div>
            推荐人数：<span>{recommenderInfo.personTotal}</span>人
          </div>
          <div>
            付费人数：<span>{recommenderInfo.payPerson}</span>人
          </div>
          <div>
            订单总数：<span>{recommenderInfo.orderTotal}</span>笔
          </div>
          <div>
            订单总额：<span>{recommenderInfo.moneyTotal}</span>元
          </div>
        </div>
      </div>
    </div>
  );
}
