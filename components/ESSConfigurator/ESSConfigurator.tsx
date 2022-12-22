import { useMemo } from "react";
import { c } from "../../utils/css";
import styles from "./ESSConfigurator.module.css";
import Link from "next/link";

export interface Config {
  serviceID: string;
  environment: "ps2" | "ps2ps4us" | "ps2ps4eu" | "all";
  baseUrl:
    | "wss://push.planetside2.com/streaming"
    | "wss://push.nanite-systems.net/streaming";
  worlds: number[] | "all";
  charactersRaw: string;
  events: string[];
  expFilterRaw: string;
  logicalAndCharactersWithWorlds: boolean;
}

interface Params {
  onUpdate: (newConfig: Config) => void;
  onStartStop: () => void;
  config: Config;
}

export default function ESSConfigurator(params: Params) {
  const isNS =
    params.config.baseUrl === "wss://push.nanite-systems.net/streaming";

  return (
    <div>
      <table className={styles.configTable}>
        <tbody>
          <tr>
            <td className={styles.label}>
              <label htmlFor="baseURL">URL</label>
            </td>
            <td className={styles.option}>
              wss://
              <select
                id="baseURL"
                className={styles.urlSelect}
                value={params.config.baseUrl}
                onChange={(e) => {
                  params.onUpdate({
                    ...params.config,
                    baseUrl: e.target.value as Config["baseUrl"],
                  });
                }}
              >
                <option value="wss://push.planetside2.com/streaming">
                  push.planetside2.com
                </option>
                <option value="wss://push.nanite-systems.net/streaming">
                  push.nanite-systems.net
                </option>
              </select>
              /streaming?environment=
              <select
                className={styles.urlSelect}
                id="environment"
                value={params.config.environment}
                onChange={(e) => {
                  params.onUpdate({
                    ...params.config,
                    environment: e.target.value as Config["environment"],
                  });
                }}
              >
                <option value="ps2">ps2</option>
                <option value="ps2ps4us">ps2ps4us</option>
                <option value="ps2ps4eu">ps2ps4eu</option>
                {isNS && <option value="all">all</option>}
              </select>
              &service-id=s:
              <input
                className={styles.urlSelect}
                id="serviceID"
                type="text"
                value={params.config.serviceID}
                onChange={(e) => {
                  params.onUpdate({
                    ...params.config,
                    serviceID: e.target.value,
                  });
                }}
              />
            </td>
          </tr>
          <tr>
            <td className={styles.label}>WORLDS</td>
            <td className={c(styles.option, styles.checkboxes)}>
              <div
                className={c(
                  styles.stackedCheckbox,
                  params.config.worlds === "all" && styles.checked
                )}
              >
                <label htmlFor="worlds-all">All</label>
                <input
                  onChange={(e) => {
                    params.onUpdate({
                      ...params.config,
                      worlds: e.target.checked ? "all" : [],
                    });
                  }}
                  type="checkbox"
                  value="all"
                  checked={params.config.worlds === "all"}
                  id="worlds-all"
                />
              </div>
              {useMemo(
                () =>
                  [
                    { name: "Connery", id: 1, env: "ps2" },
                    { name: "Miller", id: 10, env: "ps2" },
                    { name: "Cobalt", id: 13, env: "ps2" },
                    { name: "Emerald", id: 17, env: "ps2" },
                    { name: "Jaeger", id: 19, env: "ps2" },
                    { name: "SolTech", id: 40, env: "ps2" },
                    { name: "Genudine", id: 1000, env: "ps2ps4us" },
                    { name: "Ceres", id: 2000, env: "ps2ps4eu" },
                  ].map(({ name, id, env }) => {
                    const inEnv = ["all", env].includes(
                      params.config.environment
                    );
                    const checked =
                      inEnv &&
                      (params.config.worlds === "all" ||
                        params.config.worlds.includes(id));

                    const disabled = params.config.worlds === "all" || !inEnv;
                    return (
                      <div
                        key={name}
                        className={c(
                          styles.stackedCheckbox,
                          checked && styles.checked,
                          disabled && styles.disabled
                        )}
                      >
                        <label htmlFor={`worlds-${name}`}>{name}</label>
                        <input
                          onChange={(e) => {
                            params.onUpdate({
                              ...params.config,
                              worlds: [...(params.config.worlds as []), id],
                            });
                          }}
                          disabled={disabled}
                          type="checkbox"
                          value="all"
                          checked={checked}
                          id={`worlds-${name}`}
                        />
                      </div>
                    );
                  }),
                [params]
              )}
            </td>
          </tr>
          <tr>
            <td className={styles.label}>CHARACTERS</td>
            <td className={styles.option}>
              <input
                id="characters"
                className={styles.textInput}
                type="text"
                value={params.config.charactersRaw}
                placeholder="5428174054418851153, 5429340215108254113, 5428308138482921153, 5428208486477929617"
                onChange={(e) => {
                  params.onUpdate({
                    ...params.config,
                    charactersRaw: e.target.value,
                  });
                }}
              />
              &nbsp;&nbsp;&nbsp;{" "}
              <span className={styles.context}>
                —&nbsp;&nbsp;Comma separated list of character IDs. Default is
                `all`.
              </span>
            </td>
          </tr>
          <tr>
            <td className={styles.label}>EVENTS</td>
            <td className={c(styles.option, styles.checkboxes)}>
              {[
                "AchievementEarned",
                "BattleRankUp",
                "ContinentLock",
                "ContinentUnlock",
                "Death",
                "FacilityControl",
                "GainExperience",
                "ItemAdded",
                "SkillAdded",
                "MetagameEvent",
                "PlayerFacilityCapture",
                "PlayerFacilityDefend",
                "PlayerLogin",
                "PlayerLogout",
                "VehicleDestroy",
              ].map((ev) => {
                const checked = params.config.events.includes(ev);
                return (
                  <div
                    key={ev}
                    className={c(
                      styles.stackedCheckbox,
                      checked && styles.checked
                    )}
                  >
                    <label htmlFor={`event-${ev}`}>{ev}</label>
                    <input
                      onChange={(e) => {
                        params.onUpdate({
                          ...params.config,
                          events: e.target.checked
                            ? [...(params.config.events as []), ev]
                            : params.config.events.filter((e) => e !== ev),
                        });
                      }}
                      type="checkbox"
                      value="all"
                      checked={checked}
                      id={`event-${ev}`}
                    />
                  </div>
                );
              })}
            </td>
          </tr>
          <tr
            className={c(
              styles.transitionable,
              useMemo(
                () => params.config.events.includes("GainExperience"),
                [params.config.events]
              ) || styles.rowDisabled
            )}
          >
            <td className={styles.label}>EXP FILTER</td>
            <td className={styles.option}>
              <input
                id="characters"
                className={styles.textInput}
                type="text"
                value={params.config.expFilterRaw}
                placeholder="4, 5, 7, 51, 53"
                onChange={(e) => {
                  params.onUpdate({
                    ...params.config,
                    expFilterRaw: e.target.value,
                  });
                }}
              />
              &nbsp;&nbsp;&nbsp;{" "}
              <span className={styles.context}>
                —&nbsp;&nbsp;Comma separated{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://census.daybreakgames.com/s:${params.config.serviceID}/get/ps2/experience?c:limit=10000`}
                >
                  experience IDs
                </a>
                . <b>This is extremely high volume if unset.</b>
              </span>
            </td>
          </tr>
          <tr>
            <td className={styles.label}>MATCH BY</td>
            <td className={styles.option}>
              Worlds&nbsp;&nbsp;
              <select
                className={styles.urlSelect}
                value={
                  params.config.logicalAndCharactersWithWorlds
                    ? "true"
                    : "false"
                }
                onChange={(e) => {
                  params.onUpdate({
                    ...params.config,
                    logicalAndCharactersWithWorlds: e.target.value === "true",
                  });
                }}
              >
                <option value="false">OR</option>
                <option value="true">AND</option>
              </select>
              &nbsp;&nbsp; Characters &nbsp;&nbsp;&nbsp;{" "}
              <span className={styles.context}>
                —&nbsp;&nbsp;Changes backend event matching behavior. For
                example, all Deaths on Connery needs <b>AND</b>.{" "}
                <Link href="/help/logical-and">See this diagram.</Link>
              </span>
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <button
                className={styles.button}
                onClick={() => {
                  params.onStartStop();
                }}
              >
                Start/Stop Stream
              </button>{" "}
              <button className={styles.button}>Generate Code</button>{" "}
              <button
                className={styles.button}
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.href}`);
                }}
              >
                Copy URL
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
