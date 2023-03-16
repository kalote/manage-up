interface Window {
  ethereum: any;
}

interface ContextProps {
  children: React.ReactNode;
}

interface WalletContext {
  connectWallet: () => Promise<void>;
  currentAccount: string;
  isLoading: boolean;
  profile: FetchDataOutput;
}
