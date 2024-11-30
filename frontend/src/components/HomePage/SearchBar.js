import styles from './SearchBar.module.css'

const SearchBar = () => {
	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Find your ideal Tutor Today</h1>

			<div className={styles.searchContainer}>
				<input className={styles.inputField}
					type="text"
					placeholder='Try "Data Structure and Algorithms"'

				/>
				<button className={styles.button}>
					🔍
				</button>
			</div>
		</div>
	);
};

export default SearchBar;