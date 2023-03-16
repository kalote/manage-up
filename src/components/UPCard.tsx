import { useContext, useEffect, useState } from "react";
import { WalletContext } from "@/context/walletContext";
import Image from "next/image";
import { IPFS_GATEWAY_BASE_URL } from "@/constants";

const styles = {
  cardWrapper: `bg-slate-100 rounded-xl p-8 dark:bg-slate-800 mt-8 w-1/2`,
  cardMain: `pt-6 space-y-4`,
  cardImage: `w-24 h-24 rounded-full mx-auto`,
  cardDescription: `text-lg font-medium`,
  cardInfo: `font-medium`,
  cardUsername: `text-sky-500 dark:text-sky-400`,
  cardAddress: `text-slate-700 dark:text-slate-500`,
};

type ImageProfile = {
  width: number;
  height: number;
  hash: string;
  hashFunction: string;
  url: string;
};

const UPCard: React.FC = () => {
  const [profileInfo, setProfileInfo] = useState({
    username: "",
    description: "",
    links: [],
    image: {} as ImageProfile,
  });

  const { currentAccount, isLoading, profile } = useContext(
    WalletContext
  ) as WalletContext;

  useEffect(() => {
    if (!isLoading) {
      const userInfo = {
        username: profile.value.LSP3Profile.name,
        description: profile.value.LSP3Profile.description,
        links: profile.value.LSP3Profile.links,
      };
      const profilePictureInfo = profile.value.LSP3Profile.profileImage.filter(
        (item: any) => {
          if (item.width >= 100 && item.width <= 200) {
            return item;
          }
        }
      );
      const userProfileInfo = {
        ...userInfo,
        image: profilePictureInfo[0],
      };
      userProfileInfo.image.url = userProfileInfo.image.url.replace(
        "ipfs://",
        IPFS_GATEWAY_BASE_URL
      );
      setProfileInfo(userProfileInfo);
    }
  }, [profile, isLoading]);

  console.log(profileInfo);
  return (
    <figure className={styles.cardWrapper}>
      {!isLoading && (
        <>
          {profileInfo.image.url && (
            <Image
              src={profileInfo.image.url}
              alt="User profile picture"
              className={styles.cardImage}
              width={profileInfo.image.width}
              height={profileInfo.image.width}
            />
          )}
          <div className={styles.cardMain}>
            <blockquote>
              <p className={styles.cardDescription}>
                “{profileInfo.description}”
              </p>
            </blockquote>
            <figcaption className={styles.cardInfo}>
              <div className={styles.cardUsername}>{profileInfo.username}</div>
              <div className={styles.cardAddress}>{currentAccount}</div>
            </figcaption>
          </div>
        </>
      )}
    </figure>
  );
};

export default UPCard;
