import { useState } from "react";
import ESSConfigurator, { Config } from "../components/ESSConfigurator";
import styles from "../styles/Stream.module.css";

export default function Stream() {
  const [config, setConfig] = useState<Config>({
    serviceID: "example",
    environment: "ps2",
    baseUrl: "wss://push.planetside2.com/streaming",
  });
  return (
    <div className={styles.main}>
      <div className={styles.grid}>
        <div>
          <ESSConfigurator config={config} onUpdate={setConfig} />
        </div>
        <div>stream</div>
      </div>
    </div>
  );
}
