import React, { createContext, useEffect, useState } from "react";
import { ERC725, ERC725JSONSchema } from "@erc725/erc725.js";
import { FetchDataOutput } from "@erc725/erc725.js/build/main/src/types/decodeData";
import LSPs from "@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json";
import { ethers } from "ethers";

import { BLOCK_EXPLORER_URLS, CHAIN_IDS, RPC_URLS } from "../constants";

export const WalletContext = createContext<WalletContext | null>(null);

let eth: any;

if (typeof window !== "undefined") {
  eth = window.ethereum;
}

export const WalletProvider: React.FC<ContextProps> = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<LSP3Profile | undefined>();

  const connectWallet = async (): Promise<void> => {
    try {
      if (!eth) return alert("install UP!");
      setIsLoading(true);

      const provider = new ethers.providers.Web3Provider(eth);
      // popup connect
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      // check L16 test network
      if ((await signer.getChainId()) !== 2828) {
        await switchToLuksoL16Tesnet();
      }
      const address = await signer.getAddress();
      setCurrentAccount(address);
      await getUPData(address);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      throw new Error("No ethereum object.");
    }
  };

  const getUPData = async (address: string) => {
    const myErc725Contract = new ERC725(
      LSPs as ERC725JSONSchema[],
      address,
      eth
    );
    const data = (await myErc725Contract.fetchData(
      "LSP3Profile"
    )) as ProfileData;
    setProfile(data.value.LSP3Profile);
  };

  const switchToLuksoL16Tesnet = async () => {
    try {
      await eth.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xb0c" }],
      });
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (error?.code === 4902) {
        addLuksoL16Testnet();
      }
    }
  };

  const addLuksoL16Testnet = async () => {
    try {
      // Open request to add custom network
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: CHAIN_IDS.L16_HEX,
            chainName: "LUKSO L16",
            nativeCurrency: {
              name: "LUKSO",
              symbol: "LYXt",
              decimals: 18,
            },
            rpcUrls: [RPC_URLS.L16],
            blockExplorerUrls: [BLOCK_EXPLORER_URLS.L16],
          },
        ],
      });
    } catch (addErr) {
      console.error(addErr);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        connectWallet,
        currentAccount,
        isLoading,
        profile,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
