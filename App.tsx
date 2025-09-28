import TelegramInit from "@components/TelegramInit";
import Router from "./router/router";
import { ISPROD } from "config/config";
import { Platform } from "react-native";
import { Analytics } from "@vercel/analytics/react"

export default function App() {

  return (
    <>
      {Platform.OS === "web" &&
        <>
          {/* <SpeedInsights /> */}
          <Analytics/>
        </>
      }

      {ISPROD && <TelegramInit />}
      <Router />
    </>
  )

}

