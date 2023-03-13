import React, { createContext, useState } from "react";
import { ERC725, ERC725JSONSchema } from "@erc725/erc725.js";
import LSPs from "@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json";
import { ethers } from "ethers";

export const WalletContext = createContext<WalletContext | null>(null);

let eth: any;

if (typeof window !== "undefined") {
  eth = window.ethereum;
}

export const WalletProvider: React.FC<ContextProps> = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const connectWallet = async (): Promise<void> => {
    try {
      setIsLoading(true);
      if (!eth) return alert("install UP!");
      const provider = new ethers.providers.Web3Provider(eth);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      // check L16 test network
      if ((await signer.getChainId()) !== 2828) {
        return alert("Please swith to Lukso L16 test network");
      }
      setCurrentAccount(await signer.getAddress());
      const myErc725Contract = new ERC725(
        LSPs as ERC725JSONSchema[],
        currentAccount,
        eth
      );
      console.log(
        await myErc725Contract.getData([
          "LSP3Profile",
          "SupportedStandards:LSP3UniversalProfile",
        ])
      );
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      throw new Error("No ethereum object.");
    }
  };

  const isWalletConnected = async (): Promise<void> => {
    try {
      if (!eth) return alert("install MetaMask!");
      const provider = new ethers.providers.Web3Provider(eth);
      const accounts = await provider.send("eth_accounts", []);
      const signer = provider.getSigner();

      // check L16 test network
      if ((await signer.getChainId()) !== 2828) {
        return alert("Please swith to Lukso L16 test network");
      }
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      }
    } catch (error) {
      console.error(error);
      throw new Error("No ethereum object.");
    }
  };

  return (
    <WalletContext.Provider
      value={{ connectWallet, currentAccount, isLoading, isWalletConnected }}
    >
      {children}
    </WalletContext.Provider>
  );
};
