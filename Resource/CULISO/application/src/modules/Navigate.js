import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Navigate(name) {
  window.location.href = "/" + name;

  return null;
}
function TimerNavigate(ms, name) {
  const nav = useNavigate();
  const time = ms * 1000;
  let timer = useEffect(() => {
    setTimeout(() => {
      nav("/" + name);
    }, time);
  }, [nav, name, time]);

  return () => {
    clearTimeout(timer);
  };
}

export { Navigate, TimerNavigate };
