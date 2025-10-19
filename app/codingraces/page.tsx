"use client";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function CodingRaces() {
  const studentNumber = "21775745";
  const studentName = "Aastha Acharya";

  return (
    <div>
      <Header studentNumber={studentNumber} studentName={studentName} />
      <main className="container">
        <h1>Coding Races (Page under construction)</h1>
      </main>
      <Footer studentName={studentName} studentNumber={studentNumber} />
    </div>
  );
}
