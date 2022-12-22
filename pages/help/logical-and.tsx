/*
Character event filter -> in_character && (true || in_world) // or
Character event filter -> in_character && (false || in_world) // and
World event filter -> in_world
Character-World event filter -> logicalAnd ? in_character && in_world : in_character || in_world
GainExperience event -> Character event filter && in_experience
Death and VehicleDestroy event filter -> Character event that tries to match character ids against both character and attacker
*/

import { Fira_Code } from "@next/font/google";
import { c } from "../../utils/css";
import styles from "../../styles/Help-LogicalAnd.module.css";

const firaCode = Fira_Code({ subsets: ["latin"] });

export default function HelpLogicalAnd() {
  return (
    <div className={firaCode.className}>
      <h1>Logical &quot;AND&quot; vs &quot;OR&quot; Filtering Flowchart</h1>
      <p>
        Supplement to{" "}
        <a
          target="_blank"
          href="https://census.daybreakgames.com/#websocket-details"
          rel="noreferrer noopener"
        >
          Official Census Docs
        </a>{" "}
        on `logicalAndCharactersWithWorlds`.
      </p>

      <p>
        Death and VehicleDestroy events check both character_id and
        attacker_character_id when matching.
      </p>
      <p>Hover a box for specific logic statements or event names.</p>
      <br />
      <br />
      <div className={c(styles.chart)}>
        <div
          className={styles.event}
          title={
            "AcheivementEarned, BattleRankUp, Death, ItemAdded, SkillAdded, VehicleDestroy, GainExperience, PlayerFacilityCapture, PlayerFacilityDefend, PlayerLogin, PlayerLogout"
          }
        >
          Character event
        </div>
        <div>--&gt; IF </div>

        <div className={c(styles.matcher)}>
          <div
            className={styles.split}
            title="in_character && (!logicalAnd || in_world)"
          >
            <div>
              character matches [<span className={styles.or}>OR</span> is
              ignored]
            </div>
            <div>
              character <span className={styles.and}>AND</span> world matches
            </div>
          </div>
        </div>
        <div>===&gt;</div>
        <div className={styles.stream}>Send event ✅</div>
      </div>
      <div className={c(styles.chart)}>
        <div className={styles.event}>
          PlayerLogin
          <br />
          PlayerLogout
        </div>
        <div>--&gt; IF </div>

        <div className={c(styles.matcher)}>
          <div
            className={styles.split}
            title="logicalAnd ? in_character && in_world : in_character || in_world"
          >
            <div>
              character <span className={styles.or}>OR</span> world matches
            </div>
            <div>
              character <span className={styles.and}>AND</span> world matches
            </div>
          </div>
        </div>
        <div>===&gt;</div>
        <div className={styles.stream}>Send event ✅</div>
      </div>
      <div className={c(styles.chart)}>
        <div
          className={styles.event}
          title={
            "ContinentLock, ContinentUnlock, FacilityControl, MetagameEvent"
          }
        >
          World event
        </div>
        <div>--&gt; IF </div>
        <div className={styles.matcher}>world matches</div>
        <div>===&gt;</div>
        <div className={styles.stream}>Send event ✅</div>
      </div>
      <div>
        <h2>Examples</h2>
        <p>
          &gt;&gt; Subscribed to <b>events: [ Death ]</b>,{" "}
          <b>characters: [ all ]</b>, and <b>worlds: [ Connery ]</b>
          <br />
          <br />
          <br />
        </p>
        <div>
          <div>
            <span className={styles.or}>OR</span> filtering (default behavior):
            <br />
            <br />
            <div>
              <div className={styles.chart}>
                <div className={styles.event}>
                  <b>Death</b>
                  <br />
                  On Emerald, Wrel killed Higby{" "}
                </div>
                <div>--&gt;</div>
                <div className={styles.matcher}>Wrel is in character list</div>
                <div>===&gt;</div>
                <div className={c(styles.stream)}>Sending event ✅</div>
              </div>
            </div>
          </div>
          <span className={styles.and}>AND</span> filtering:
          <br />
          <br />
          <div>
            <div className={styles.chart}>
              <div className={styles.event}>
                <b>Death</b>
                <br />
                On Emerald, Wrel killed Higby{" "}
              </div>
              <div>--&gt;</div>
              <div className={styles.matcher}>
                Wrel is in character list
                <br />
                <b>EXCEPT</b>
                <br />
                Emerald is NOT in world list
              </div>
              <div>===&gt;</div>
              <div className={c(styles.stream, styles.streamRejected)}>
                Not sending event ❌
              </div>
            </div>
            <div>
              <div className={styles.chart}>
                <div className={styles.event}>
                  <b>Death</b>
                  <br />
                  On Connery,{" "}
                  <span title="Do not pat this cat. Or do. I'm not a cop.">
                    Silzz
                  </span>{" "}
                  killed Conflictt
                </div>
                <div>--&gt;</div>
                <div className={styles.matcher}>
                  <span title="Do not pat this cat. Or do. I'm not a cop.">
                    Silzz
                  </span>{" "}
                  is in character list
                  <br />
                  <span className={styles.and}>AND</span>
                  <br />
                  Connery is in world list
                </div>
                <div>===&gt;</div>
                <div className={c(styles.stream)}>Sending event ✅</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
