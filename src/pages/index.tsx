import Head from "next/head";
import { useContext } from "react";
import { WalletContext } from "@/context/walletContext";

const style = {
  wrapper: `h-screen w-full bg-[#2D242F] text-white select-none flex flex-col justify-between`,
  buttonWrapper: `flex items-center justify-center h-screen`,
  button: `bg-[#2172E5] my-2 rounded-2xl py-2 px-4 text-m flex items-center justify-between cursor-pointer border border-[#2172E5] hover:border-[#234169]`,
};

export default function Home() {
  const { currentAccount, connectWallet } = useContext(
    WalletContext
  ) as WalletContext;

  return (
    <>
      <Head>
        <title>UP! Management console</title>
        <meta name="description" content="Manage your UP!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={style.wrapper}>
        <div className={style.buttonWrapper}>
          {currentAccount ? (
            <p>{currentAccount}</p>
          ) : (
            <button className={style.button} onClick={() => connectWallet()}>
              Connect your UP!
            </button>
          )}
        </div>
      </main>
    </>
  );
}
