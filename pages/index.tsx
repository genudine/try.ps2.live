import styles from "../styles/Home.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.main}>
      <h1>Tools for the PlanetSide 2 Census API</h1>
      <Link href="/stream">
        <section>Event Stream Playground -&gt;</section>
      </Link>
      <Link href="/census">
        <section>Census API Query Builder -&gt;</section>
      </Link>
    </div>
  );
}
