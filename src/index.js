import React from 'react';
import ReactDOM from 'react-dom/client';
import Board from './Components/Board';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import axios from 'axios';
// import Board2 from './Components/Board2'

// async function getTournament(){
//   var url = new URL(window.location.href);
//   var id = url.searchParams.get("id");
//   console.log("param:"+id);
//   var urldatabase = "http://localhost:5000/tournament?id="+id;
//   await axios.get(urldatabase)
//   .then(function (response) {
//     return response.data;
//     // console.log(response.data);
//     // return "kakakaka";
//   })
//   .catch(function (error) {
//     console.log("Error gettournament:"+error);
//   });
// }
const root = ReactDOM.createRoot(document.getElementById('root'));

// const save = {
//   name:"xin asndasdad",
//   indo:1234,
// }

// getTournament().then((resuft)=>{
//   console.log("Resuft:");
//   console.log(resuft);
//   root.render(
//     <div>
//       <Board2 tournament={save}/>
//     </div>
//   );
// }).catch(function(err){
//   root.render(
//     <div>
//       <Board2 tournament="hello babay" />
//     </div>
//   );
// });




root.render(
  <div>
    {/* <Board2 /> */}
    <Board />
  </div>
);
