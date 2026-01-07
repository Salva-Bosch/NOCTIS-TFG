// Minimal React entry for solar-map (placeholder)
import React from 'react';
import { createRoot } from 'react-dom/client';
function App(){
  return React.createElement('div',null,'Solar Map placeholder');
}
const root = document.getElementById('root');
if(root){
  createRoot(root).render(React.createElement(App));
}
