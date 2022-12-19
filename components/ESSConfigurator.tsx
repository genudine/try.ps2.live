export interface Config {
  serviceID: string;
  environment: "ps2" | "ps2ps4us" | "ps2ps4eu" | "all";
  baseUrl:
    | "wss://push.planetside2.com/streaming"
    | "wss://push.nanite-systems.net/streaming";
}

interface Params {
  onUpdate: (newConfig: Config) => void;
  config: Config;
}

export default function ESSConfigurator(params: Params) {
  const isNS =
    params.config.baseUrl === "wss://push.nanite-systems.net/streaming";

  return (
    <div>
      <div>
        wss://
        <select
          id="baseURL"
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
      </div>
      <div></div>
    </div>
  );
}
