import styles from './Home.module.css'
import SearchBar from "../../components/HomePage/SearchBar";
import TutorList from "../../components/HomePage/TutorList";


export default function Home() {

	return (
		<div>
			<SearchBar />
			<TutorList />
		</div>
	)

};