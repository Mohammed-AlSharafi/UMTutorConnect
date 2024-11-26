import styles from "./ProfileImage.module.css";

export default function ProfileImage({ src, alt }) {
    return (
        <div className={styles.profileImgContainer}>
            <img src={src} alt={alt} />
        </div>
    )
}