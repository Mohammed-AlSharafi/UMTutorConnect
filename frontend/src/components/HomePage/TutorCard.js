const TutorCard = ({ name, subject, rate , img}) => {
	return (
		<div
			style={{
				border: "1px solid #ddd",
				borderRadius: "10px",
				padding: "15px",
				width: "500px",
				margin: "20px 30px",

			}}
		>
			<img
				src={img}
				alt="Tutor Image"
				style={{ borderRadius: "10px", width: "100%", maxHeight: "220px" }}
			/>
			<h3>{name}</h3>
			<p>{subject}</p>
			<h4 style={{textAlign: "right" , paddingRight: "20px"}}>{rate} RM/H</h4>
		</div>
	);
};

export default TutorCard;