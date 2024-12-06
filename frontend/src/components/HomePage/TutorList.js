import TutorCard from "./TutorCard";

const TutorList = ({ tutors, title }) => {


	return (
		<div style={{ background: "#f9f9f9", padding: "10px" }}>
		  {/* Always display the title */}
		  <h1 style={{ textAlign: "left", marginLeft: "90px", fontSize: "20px" }}>
			{title}
		  </h1>
	
		  {/* Show message if no tutors are available */}
		  {tutors.length === 0 ? (
			<p style={{ textAlign: "center", color: "#888", fontSize: "16px" }}>
			  Uh-oh! It seems there are no tutors available for this subject.
			</p>
		  ) : (
			<div
			  style={{
				display: "flex",
				justifyContent: "center",
				flexWrap: "wrap",
				background: "#f9f9f9",
				padding: "5px",
			  }}
			>
			  {/* Show tutor cards if tutors are available */}
			  {tutors.map((tutor, index) => (
				<TutorCard
				  key={index}
				  name={tutor.fullName}
				  subjects={tutor.subjects}
				  rate={tutor.rate}
				  img={tutor.img}
				/>
			  ))}
			</div>
		  )}
		</div>
	  );
	};

export default TutorList;