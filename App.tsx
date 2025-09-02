import TelegramInit from "@components/TelegramInit";
import Router from "./router/router";
import { ISPROD } from "config/config";
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Platform } from "react-native";


export default function App() {

  return (
    <>
      {Platform.OS === "web" && <SpeedInsights />}
      {ISPROD && <TelegramInit />}
      <Router />
    </>
  )

}

