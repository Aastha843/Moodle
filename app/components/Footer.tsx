"use client";

type FooterProps = {
  studentNumber?: string;
  studentName?: string;
};

export default function Footer({
  studentNumber = "21775745",
  studentName = "Aastha Acharya",
}: FooterProps) {
  const today = new Date().toLocaleDateString("en-AU");
  return (
    <footer className="footer" role="contentinfo">
      &copy;{new Date().getFullYear()} {studentName} ({studentNumber}) · {today}
    </footer>
  );
}
