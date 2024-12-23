import styles from "./ProfileImage.module.css";

export default function ProfileImage({ src, alt, isEditing, onProfilePictureChange }) {
    return (
        <div className={`${styles.profileImgContainer} ${isEditing ? styles.editing : ""}`}>
            {isEditing ? (
                <label>
                    <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={onProfilePictureChange}
                    />
                    <img src={src} alt={alt} title="Click to change profile picture" />
                </label>
            ) : (
                <img src={src} alt={alt} />
            )}
        </div>
    )
}