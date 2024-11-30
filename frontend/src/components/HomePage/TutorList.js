import TutorCard from "./TutorCard";

const TutorList = () => {
	const tutors = [
		{ name: "John Doe", subject: "Data Structures", rate: 20 , img: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
		{ name: "Jane Smith", subject: "Algorithms", rate: 25 , img: "https://plus.unsplash.com/premium_photo-1658506795539-8c3e055c960c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
		{ name: "Chris Lee", subject: "Machine Learning", rate: 30 , img: "https://images.unsplash.com/photo-1495603889488-42d1d66e5523?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},

		// You can add more here
	];

	return (
		<div style={{ background: "#f9f9f9", padding: "10px"}}>

			<h1 style={{ textAlign: "left", marginLeft: "90px" , fontSize: "20px"}}>Top Tutor Listing</h1>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					flexWrap: "wrap",
					background: "#f9f9f9",
					padding: "5px",
				}}
			>
				{tutors.map((tutor, index) => (
					<TutorCard
						key={index}
						name={tutor.name}
						subject={tutor.subject}
						rate={tutor.rate}
						img={tutor.img}
					/>
				))}
			</div>
		</div>
	);
};

export default TutorList;