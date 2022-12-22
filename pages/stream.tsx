import { useEffect, useMemo, useState } from "react";
import ESSConfigurator, {
  Config,
} from "../components/ESSConfigurator/ESSConfigurator";
import styles from "../styles/Stream.module.css";
import { useRouter } from "next/router";
import { Fira_Code } from "@next/font/google";
import { c } from "../utils/css";

const firaCode = Fira_Code({ subsets: ["latin"] });

export default function Stream() {
  const router = useRouter();

  const [config, setConfig] = useState<Config>({
    serviceID: "example",
    environment: "ps2",
    baseUrl: "wss://push.planetside2.com/streaming",
    worlds: "all",
    charactersRaw: "",
    events: ["Death", "VehicleDestroy"],
    expFilterRaw: "",
    logicalAndCharactersWithWorlds: true,
    ...JSON.parse((router.query.c as string) || "{}"), // If server can see it, lets try it...
  });
  const [streamState, setStreamState] = useState<"stopped" | "started">(
    "stopped"
  );

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
    // TODO: make less bad
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
          <div className={c(styles.panelHead)}>-&gt; CONFIGURATOR</div>
          <ESSConfigurator
            config={config}
            onUpdate={configUpdate}
            onStartStop={() => {
              setStreamState(streamState === "started" ? "stopped" : "started");
            }}
          />
        </div>
        <div>
          <div className={c(styles.panelHead)}>
            -&gt; STREAM DATA [{" "}
            <span
              style={{
                color: streamState === "started" ? "limegreen" : "grey",
              }}
            >
              {streamState === "started" ? "RUNNING" : "STOPPED"}
            </span>{" "}
            ]
          </div>
          <div className={c(firaCode.className, styles.stream)}>
            <pre>
              &lt;&lt;==[META] Will connect to {config.baseUrl}?environment=
              {config.environment}&service-id=s:{config.serviceID}
              <br />
              &lt;&lt;==[META] Will send message after connect:
              <br />
              {JSON.stringify(
                {
                  service: "event",
                  action: "subscribe",
                  characters: useMemo(() => {
                    if (config.charactersRaw) {
                      return config.charactersRaw
                        .split(",")
                        .map((x) => x.trim());
                    }

                    return ["all"];
                  }, [config.charactersRaw]),
                  eventNames: useMemo(() => {
                    let events = [...config.events];
                    if (
                      config.events.includes("GainExperience") &&
                      config.expFilterRaw
                    ) {
                      events = events.filter((x) => x !== "GainExperience");
                      config.expFilterRaw.split(",").forEach((x) => {
                        events.push(`GainExperience_experience_id_${x.trim()}`);
                      });
                    }
                    return events;
                  }, [config.events, config.expFilterRaw]),
                  worlds: config.worlds === "all" ? ["all"] : config.worlds,
                  logicalAndCharactersWithWorlds:
                    config.logicalAndCharactersWithWorlds,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
