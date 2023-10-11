import { useContext, useState } from "react";
import useLegacyEffect from "@/hooks/useLegacyEffect";
import { WalletContext } from "@/context/walletContext";
import Image from "next/image";

const styles = {
  cardWrapper: `bg-slate-100 rounded-xl p-8 dark:bg-slate-800 mt-8 w-1/2 max-w-lg`,
  cardMain: `pt-6 space-y-4`,
  cardImage: `w-24 h-24 rounded-full mx-auto`,
  cardDescription: `text-lg font-medium`,
  cardInfo: `font-medium`,
  cardUsername: `text-sky-500 dark:text-sky-400`,
  cardAddress: `text-slate-700 dark:text-slate-500`,
};

const UPCard: React.FC = () => {
  const [profileInfo, setProfileInfo] = useState<LSP3Profile>();

  const { currentAccount, isLoading, profile } = useContext(
    WalletContext
  ) as WalletContext;

  useLegacyEffect(() => {
    if (!isLoading) {
      setProfileInfo(profile);
    }
  }, [profile, isLoading]);

  return (
    <figure className={styles.cardWrapper}>
      {!isLoading && profileInfo && (
        <>
          {profileInfo.profileImage[0] ? (
            <Image
              src={profileInfo.profileImage[0].url}
              alt="User profile picture"
              className={styles.cardImage}
              width={profileInfo.profileImage[0].width}
              height={profileInfo.profileImage[0].width}
            />
          ) : (
            <Image
              src={"/emptyProfile.jpg"}
              alt="Empty user profile picture"
              className={styles.cardImage}
            />
          )}
          <div className={styles.cardMain}>
            <blockquote>
              <p className={styles.cardDescription}>
                {profileInfo.description
                  ? `“${profileInfo.description}”`
                  : "<empty>"}
              </p>
            </blockquote>
            <figcaption className={styles.cardInfo}>
              <div className={styles.cardUsername}>
                {profileInfo.name ? profileInfo.name : "<Anonymous>"}
              </div>
              <div className={styles.cardAddress}>{currentAccount}</div>
            </figcaption>
          </div>
        </>
      )}
    </figure>
  );
};

export default UPCard;
