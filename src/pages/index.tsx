import Head from "next/head";
import { useContext } from "react";
import { WalletContext } from "@/context/walletContext";
import { SyncLoader } from "react-spinners";
import UPCard from "@/components/UPCard";

const style = {
  wrapper: `h-full w-full min-h-screen bg-[#2D242F] text-white select-none flex flex-col justify-center`,
  buttonWrapper: `flex items-center justify-center`,
  button: `bg-[#2172E5] my-2 rounded-2xl py-2 px-4 text-m flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169] w-44 h-11 text-center`,
  loader: `absolute top-0 left-0 w-full h-full flex justify-center items-center rounded-2xl`,
};

export default function Home() {
  const { currentAccount, connectWallet, isLoading } = useContext(
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
            <>{!isLoading && <UPCard />}</>
          ) : (
            <button className={style.button} onClick={() => connectWallet()}>
              {isLoading ? (
                <div className={style.loader}>
                  <SyncLoader size={15} loading={true} color={"#fff"} />
                </div>
              ) : (
                <p>Connect your UP!</p>
              )}
            </button>
          )}
        </div>
      </main>
    </>
  );
}
