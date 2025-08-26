'use client';
import Header from'../components/Header';
import Footer from'../components/Footer';
import Cookies from'js-cookie';
import{ useState,useEffect} from'react';

export default function EscapeRoom(){
  const studentNumber='21775745';
  const studentName='Aastha Acharya';
  const [darkMode,setDarkMode]=useState(false);

  useEffect(()=>{
    const savedMode=Cookies.get('darkMode')==='true';
    setDarkMode(savedMode);
  },[]);

  return(
    <div style={{minHeight:'100vh',backgroundColor:darkMode?'#222':'#fff',color:darkMode?'#fff':'#000'}}>
      <Header studentNumber={studentNumber}/>
      <main style={{padding:20}}>
        <h1>Escape Room(Future Enhancement)</h1>
      </main>
      <Footer studentName={studentName}studentNumber={studentNumber}/>
    </div>
  );
}
