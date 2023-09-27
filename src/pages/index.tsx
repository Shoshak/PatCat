import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import Cat from "~/components/cat";

export default function Home() {
  return (
    <>
      <Head>
        <title>PatCat</title>
        <meta name="description" content="Pat your cats!" />
      </Head>
      <main>
        <Cat row={1}></Cat>
        <Cat row={2}></Cat>
        <Cat row={3}></Cat>
      </main>
    </>
  );
}
