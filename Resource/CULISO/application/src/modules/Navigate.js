//import { useEffect } from "react";
//import { useNavigate } from "react-router-dom";

export const Navigate = (name) => {
  // const navigate = useNavigate();
  // const nav = () =>{
  //   navigate('/' + name);
  // };

  window.location.href = "/" + name;

  
  return null;//(<div><button onClick={nav}>Navigate</button></div>);
}

export const TimerNavigate = (ms, name) => {
  //const nav = useNavigate();
  const time = ms * 1000;
  // let timer = useEffect(() => {
  //   setTimeout(() => {
  //     nav("/" + name);
  //   }, time);
  // }, [nav, name, time]);
  let timer = setTimeout(()=>{
    window.location.href = "/" + name;
  }, time)

  return () => {
    clearTimeout(timer);
  };
}
