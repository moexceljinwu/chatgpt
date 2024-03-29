"use client";

require("../polyfill");

import { useState, useEffect } from "react";

import styles from "./home.module.scss";

import BotIcon from "../icons/bot.svg";
import LoadingIcon from "../icons/three-dots.svg";

import { getCSSVar, useMobileScreen } from "../utils";

import dynamic from "next/dynamic";
import { Path, SlotID } from "../constant";
import { ErrorBoundary } from "./error";

import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { SideBar } from "./sidebar";
import { useAppConfig } from "../store/config";

export function Loading(props: { noLogo?: boolean }) {
  return (
    <div className={styles["loading-content"] + " no-dark"}>
      {!props.noLogo && <BotIcon />}
      <LoadingIcon />
    </div>
  );
}

const Settings = dynamic(async () => (await import("./settings")).Settings, {
  loading: () => <Loading noLogo />,
});

const Chat = dynamic(async () => (await import("./chat")).Chat, {
  loading: () => <Loading noLogo />,
});

const NewChat = dynamic(async () => (await import("./new-chat")).NewChat, {
  loading: () => <Loading noLogo />,
});

const MaskPage = dynamic(async () => (await import("./mask")).MaskPage, {
  loading: () => <Loading noLogo />,
});

const Login = dynamic(async () => (await import("./login")).Login, {
  loading: () => <Loading noLogo />,
});

const Register = dynamic(async () => (await import("./register")).Register, {
  loading: () => <Loading noLogo />,
});

const Commodity = dynamic(async () => (await import("./commodity")).Commodity, {
  loading: () => <Loading noLogo />,
});

const Paying = dynamic(async () => (await import("./paying")).Paying, {
  loading: () => <Loading noLogo />,
});
const LoginUp = dynamic(async () => (await import("./login-up")).LoginUp, {
  loading: () => <Loading noLogo />,
});
const ChangePh = dynamic(async () => (await import("./changeph")).ChangePh, {
  loading: () => <Loading noLogo />,
});
const ModifyPa = dynamic(async () => (await import("./modifypa")).ModifyPa, {
  loading: () => <Loading noLogo />,
});

const Recommender = dynamic(
  async () => (await import("./recommender")).Recommender,
  {
    loading: () => <Loading noLogo />,
  },
);
export function useSwitchTheme() {
  const config = useAppConfig();

  useEffect(() => {
    document.body.classList.remove("light");
    document.body.classList.remove("dark");

    if (config.theme === "dark") {
      document.body.classList.add("dark");
    } else if (config.theme === "light") {
      document.body.classList.add("light");
    }

    const metaDescriptionDark = document.querySelector(
      'meta[name="theme-color"][media]',
    );
    const metaDescriptionLight = document.querySelector(
      'meta[name="theme-color"]:not([media])',
    );

    if (config.theme === "auto") {
      metaDescriptionDark?.setAttribute("content", "#151515");
      metaDescriptionLight?.setAttribute("content", "#fafafa");
    } else {
      const themeColor = getCSSVar("--themeColor");
      metaDescriptionDark?.setAttribute("content", themeColor);
      metaDescriptionLight?.setAttribute("content", themeColor);
    }
  }, [config.theme]);
}

const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
};

function Screen() {
  const config = useAppConfig();
  const location = useLocation();
  const isHome = location.pathname === Path.Home;
  const isMobileScreen = useMobileScreen();

  return (
    <div
      className={
        styles.container +
        ` ${
          config.tightBorder && !isMobileScreen
            ? styles["tight-container"]
            : styles.container
        }`
      }
    >
      <SideBar className={isHome ? styles["sidebar-show"] : ""} />
      <div className={styles["window-content"]} id={SlotID.AppBody}>
        <Routes>
          <Route path={Path.ModifyPa} element={<ModifyPa />} />
          <Route path={Path.ChangePh} element={<ChangePh />} />
          <Route path={Path.Login} element={<Login />} />
          <Route path={Path.LoginUP} element={<LoginUp />} />
          <Route path={Path.Register} element={<Register />}></Route>
          <Route path={Path.Commodity} element={<Commodity />}></Route>
          <Route
            path={`${Path.Paying}/:commodityId`}
            element={<Paying />}
          ></Route>
          <Route path={Path.Recommender} element={<Recommender />} />
          <Route path={Path.Home} element={<Chat />} />
          <Route path={Path.NewChat} element={<NewChat />} />
          <Route path={Path.Masks} element={<MaskPage />} />
          <Route path={Path.Chat} element={<Chat />} />
          <Route path={Path.Settings} element={<Settings />} />
        </Routes>
      </div>

      <div className={styles["footer"]}>
        <span>浙ICP备2023012007号-1</span>
      </div>
    </div>
  );
}

export function Home() {
  useSwitchTheme();

  if (!useHasHydrated()) {
    return <Loading />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <Screen />
      </Router>
    </ErrorBoundary>
  );
}
