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
  profile: LSP3Profile | undefined;
}

interface ImageInfo {
  width: number;
  height: number;
  hash: string;
  hashFunction: string;
  url: string;
}

interface Link {
  title: string;
  url: string;
}

interface Tag {}

interface ProfileData {
  key: string;
  name: string;
  value: { LSP3Profile };
}

interface LSP3Profile {
  backgroundImage: ImageInfo[] | [];
  description: string;
  name: string;
  profileImage: ImageInfo[] | [];
  links?: Link[];
  tags?: Tag[];
}
