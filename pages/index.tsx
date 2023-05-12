"use client"; // this is a client component 👈🏽

import { useCleanup } from "@/hooks/useCleanup";
import styles from "./page.module.css";
import { useState, MouseEvent, useMemo } from "react";
import { usePull } from "@/hooks/usePull";
import BeforeAfter from "@/components/beforeAfter";
import { error } from "console";
import Head from "next/head";

export default function Home() {
  const [jobId, setJobId] = useState<number | null>(null);
  const { data: revised, isFetching: fetching } = usePull(jobId);
  const [text, setText] = useState(
    "На прошлой неділі у вівторок решив написати цю програму"
  );
  const { data, isLoading, error, isError, mutateAsync } = useCleanup(text);

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutateAsync().then((data) => {
      data.ts && setJobId(data.ts);
    });
  };

  const tooLong = useMemo(() => {
    return text.length > 1000;
  }, [text]);

  return (
    <>
      <Head>
        <title>Десуржифікатор - позбався суржику</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.description}></div>
        <h1>Десуржифікатор</h1>
        <h3>Прибирання суржику з текстів</h3>
        <div className={styles.center}>
          <form className={styles.form}>
            <textarea
              className={styles.textarea}
              disabled={isLoading}
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
            {fetching ? (
              <strong>Поводьтеся чемно, йде десуржифікація &#8987;</strong>
            ) : (
              <>
                {tooLong && (
                  <strong className={styles.error}>
                    Шановний, поводьтеся скромніше. Тут вже {text.length} літер
                    назбиралося
                  </strong>
                )}
                {isError && (
                  <strong className={styles.error}>
                    {(error as Error).message}
                  </strong>
                )}
                {revised && revised.error && (
                  <strong className={styles.error}>{revised.error}</strong>
                )}
                <button disabled={fetching || tooLong} onClick={handleSubmit}>
                  Прибрати суржик
                </button>
              </>
            )}
          </form>

          {revised && (
            <div className={styles.revised}>
              <h3>Десуржифіковано</h3>
              <textarea
                readOnly={true}
                className={styles.textarea}
                value={revised.content}
              />
            </div>
          )}
          <BeforeAfter />
        </div>

        <div className={styles.grid}></div>
        <footer className={styles.footer}>
          &copy;{" "}
          <a href="https://github.com/mosquid" target="_blank">
            Mosquid
          </a>
          &nbsp;& GPT-3-turbo
        </footer>
      </main>
    </>
  );
}
