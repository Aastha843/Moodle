'use client';
interface FooterProps {
  studentName:string;
  studentNumber:string;
}

export default function Footer({studentName,studentNumber}:FooterProps){
  const date=new Date().toLocaleDateString();

  return (
    <footer
      style={{
        padding:'10px 20px',
        marginTop:'20px',
        borderTop:'1px solid #ccc',
        textAlign:'center',
      }}
    >
      &copy;{date}{studentName}({studentNumber})
    </footer>
  );
}
