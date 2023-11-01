import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import boltIcon from "../assets/bolt.svg";
import api from "../lib/axios";

export default function Home() {
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);

  const shortenUrl = async (e: FormEvent) => {
    e.preventDefault();
    if (!url) {
      toast.error("Please enter a URL", {
        autoClose: 2000,
      });
      return;
    }

    setLoading(true);
    const res = api
      .post("/api/shorten", {
        url,
        slug,
      })
      .then((res) => {
        const { data } = res;
        // copy to clipboard
        navigator.clipboard.writeText(data.link);
        toast.success("Copied to clipboard!", {
          autoClose: 3000,
        });
      })
      .catch((e) => {
        toast.error(e.message, {
          autoClose: 3000,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Head>
        <title>Raijin</title>
        <meta
          name="description"
          content="Raijin is a url shortener! made with nextjs"
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="author" content="@rafaelsilva81" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-screen w-screen flex flex-1 justify-center items-center bg-gradient-to-br from-sky-800 to-violet-900">
        <div className="flex flex-col p-4 gap-2 md:p-0">
          <div className="flex items-stretch">
            <h1 className="text-6xl font-bold text-white"> Raijin </h1>
            <Image
              src={boltIcon}
              alt="Raijin"
              className="h-16 w-16"
              style={{ transform: "scale(-1,1)" }}
            />
          </div>
          <p className="text-xl text-white">
            Simple URL Shortener made by {""}
            <Link href="https://rafaeldev.me" className="text-sky-400">
              @rafaelsilva81
            </Link>
          </p>

          <form onSubmit={shortenUrl} className="flex flex-col gap-2 mt-4">
            <input
              type="text"
              className="rounded-md p-2 h-12"
              placeholder="Paste your URL here"
              name="url"
              defaultValue={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <div className="flex flex-1 items-center gap-1">
              <span className="text-white text-lg font-bold">raijin.tk/s/</span>
              <input
                type="text"
                className="rounded-md p-2 h-12 flex-1"
                placeholder="Custom URL (optional)"
                name="slug"
                defaultValue={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>

            {loading ? (
              <button
                type="submit"
                disabled
                className="bg-gray-500 rounded-md text-white p-2 h-12 font-bold uppercase transition ease-in-out"
              >
                Loading...
              </button>
            ) : (
              <button
                type="submit"
                className="bg-sky-600 rounded-md text-white p-2 h-12 font-bold uppercase hover:bg-sky-500 transition ease-in-out"
              >
                Shorten!
              </button>
            )}
          </form>

          <div className="flex flex-col mt-10">
            <a
              href="https://github.com/rafaelsilva81/raijin"
              className="text-white text-lg font-bold"
            >
              See the code on Github
            </a>
          </div>
        </div>
        <ToastContainer
          position="bottom-center"
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover={false}
        />
      </main>
    </>
  );
}
