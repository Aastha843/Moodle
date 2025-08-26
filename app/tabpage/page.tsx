'use client';
import{ useState,useEffect}from'react';
import Header from'../components/Header';
import Footer from'../components/Footer';
import Cookies from'js-cookie';

interface Tab{
  id:number;
  heading:string;
  content:string;
}

export default function TabPage(){
  const studentNumber='21775745';
  const studentName='Aastha Acharya';
  const[darkMode,setDarkMode]=useState(false);
  const[tabs,setTabs]=useState<Tab[]>([]);
  const[isClient,setIsClient]=useState(false);

  useEffect(()=>{
    const savedMode=Cookies.get('darkMode')==='true';
    setDarkMode(savedMode);
    setIsClient(true);

    const storedTabs=localStorage.getItem('tabs');
    const initialTabs=storedTabs
      ? JSON.parse(storedTabs)
      :[{id:1,heading:'Tab 1',content:'Content 1'}];
    setTabs(initialTabs);
  },[]);

  useEffect(()=>{
    if(isClient){
      localStorage.setItem('tabs',JSON.stringify(tabs));
      Cookies.set('darkMode',String(darkMode));
    }
  }, [tabs,darkMode,isClient]);

  const toggleDarkMode=()=>{
    setDarkMode(!darkMode);
  };

  const addTab=()=>{
    if (tabs.length>=15)return;
    setTabs([...tabs,{id:tabs.length+1,heading:`Tab${tabs.length+1}`,content:''}]);
  };

  const removeTab=(id:number)=>{
    setTabs(tabs.filter(tab=>tab.id!==id));
  };

  const updateTab=(id:number,key:'heading'|'content',value:string)=>{
    setTabs(tabs.map(tab=>(tab.id===id?{...tab,[key]:value}:tab)));
  };

  if(!isClient)return null;

  return(
    <div style={{minHeight:'100vh',backgroundColor:darkMode?'#222':'#fff',color:darkMode?'#fff':'#000'}}>
      <Header studentNumber={studentNumber} />
      <main style={{ padding: 20 }}>
        <h1>Tabs Page</h1>
        <button onClick={addTab} style={{marginBottom:10 }}>+Add Tab</button>
        {tabs.map(tab => (
          <div key={tab.id}style={{marginTop:10,border:'1px solid#ccc',padding:10}}>
            <input
              value={tab.heading}
              onChange={e=>updateTab(tab.id,'heading',e.target.value)}
              style={{ width:'100%',marginBottom:5}}
            />
            <textarea
              value={tab.content}
              onChange={e=>updateTab(tab.id,'content',e.target.value)}
              style={{width:'100%'}}
            />
            <button onClick={()=>removeTab(tab.id)}style={{marginTop:5}}>-Remove Tab</button>
          </div>
        ))}
      </main>
      <Footer studentName={studentName} studentNumber={studentNumber} />
    </div>
  );
}
