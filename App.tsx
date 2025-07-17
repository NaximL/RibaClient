import TelegramInit from "@components/TelegramInit";
import Router from "./router";
import { ISPROD } from "config/config";



export default function App() {

  return (
    <>
      {ISPROD && <TelegramInit />}
      <Router />
    </>
  )

}

