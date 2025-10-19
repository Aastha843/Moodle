"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AboutPage() {
  const studentNumber = "21775745";
  const studentName = "Aastha Acharya";

  return (
    <div>
      <Header studentNumber={studentNumber} studentName={studentName} />
      <main className="container">
        <h1 style={{ marginTop: 0 }}>About</h1>
        <p><strong>Name:</strong> {studentName}</p>
        <p><strong>Student Number:</strong> {studentNumber}</p>

        <h2>How to use this website (Video)</h2>
        <p>Record a 3–8 min walkthrough and place it at <code>/public/how-to.mp4</code>.</p>
        <video controls width={720} style={{ maxWidth: "100%", border: "1px solid #ccc" }}>
          <source src="/how-to.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </main>
      <Footer studentName={studentName} studentNumber={studentNumber} />
    </div>
  );
}
