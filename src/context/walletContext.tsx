import React, { createContext, useState } from "react";
import { ERC725, ERC725JSONSchema } from "@erc725/erc725.js";
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

      // check testnet
      if ((await signer.getChainId()) !== 4201) {
        await switchToLuksoTesnet();
      }
      const address = await signer.getAddress();

      // check if support LSP0 interface (UP)
      const isUP = await ERC725.supportsInterface("LSP0ERC725Account", {
        address,
        rpcUrl: RPC_URLS.TESTNET,
      });
      if (!isUP) {
        setIsLoading(false);
        return alert("Connected Wallet is not a UP!");
      }

      setCurrentAccount(address);
      await getUPData(address);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object.");
    }
  };

  const getUPData = async (address: string) => {
    try {
      const myErc725Contract = new ERC725(
        LSPs as ERC725JSONSchema[],
        address,
        eth
      );
      const data = (await myErc725Contract.fetchData(
        "LSP3Profile"
      )) as ProfileData;
      setProfile(data.value.LSP3Profile);
    } catch (error) {
      console.error(error);
      throw new Error("Issue getting the Universal Profile Data");
    }
  };

  const switchToLuksoTesnet = async () => {
    try {
      await eth.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xb0c" }],
      });
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (error?.code === 4902) {
        addLuksoTestnet();
      }
    }
  };

  const addLuksoTestnet = async () => {
    try {
      // Open request to add custom network
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: CHAIN_IDS.TESTNET_HEX,
            chainName: "LUKSO L16",
            nativeCurrency: {
              name: "LUKSO",
              symbol: "LYXt",
              decimals: 18,
            },
            rpcUrls: [RPC_URLS.TESTNET],
            blockExplorerUrls: [BLOCK_EXPLORER_URLS.TESTNET],
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
