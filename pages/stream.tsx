import { useEffect, useState } from "react";
import ESSConfigurator, {
  Config,
} from "../components/ESSConfigurator/ESSConfigurator";
import styles from "../styles/Stream.module.css";
import { useRouter } from "next/router";

export default function Stream() {
  const router = useRouter();

  const [config, setConfig] = useState<Config>({
    serviceID: "example",
    environment: "ps2",
    baseUrl: "wss://push.planetside2.com/streaming",
    worlds: "all",
    charactersRaw: "",
    events: [],
    expFilterRaw: "",
    logicalAndCharactersWithWorlds: false,
  });

  useEffect(() => {
    if (router.query.c) {
      try {
        const newConfig = JSON.parse(router.query.c as string) as Config;
        setConfig({
          ...config,
          ...newConfig,
        });
      } catch (e) {
        console.error(e);
      }
    }
    // If we add config as a dep, we'll get an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.c]);

  const configUpdate = (newConfig: Config) => {
    // Add the new config to the URL
    const newURL = new URL(location.href);
    newURL.searchParams.set("c", JSON.stringify(newConfig));
    window.history.replaceState(null, "", newURL);

    setConfig(newConfig);
  };

  return (
    <div className={styles.main}>
      <div className={styles.grid}>
        <div>
          <div className={styles.panelHead}>STREAM CONFIG</div>
          <ESSConfigurator
            config={config}
            onUpdate={configUpdate}
            onStartStop={() => {}}
          />
        </div>
        <div>
          <div className={styles.panelHead}>STREAM DATA</div>
        </div>
      </div>
    </div>
  );
}
