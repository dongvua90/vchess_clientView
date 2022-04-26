import React,{useRef,useState,useEffect,Component} from 'react';
import { Stage,Rect, Layer, Circle, Text,Image } from 'react-konva';
import Header from './Header';
import ViewMoves from './ViewMoves';
import axios from 'axios';
import ChessUtil from './ChessUtil'

 function getJSON() {
  let url = new URL(window.location.href);
  let id = url.searchParams.get("id");
  console.log("param:"+id);
  var urldatabase = "http://localhost:5000/tournament?id="+id;
  // To make the function blocking we manually create a Promise.
  return new Promise( function(resolve) {
      axios.get(urldatabase)
          .then( function(json) {
              // The data from the request is available in a .then block
              // We return the result using resolve.
              resolve(json);
          });
  });
}

function Board(){
  const [sqsize,setSqSize]=useState(window.innerHeight/12);
  const [flip,setFlip]=useState(false);
  const [mainfen,setFen]=useState("rnbqkbnrpppppppp--------------------------------PPPPPPPPRNBQKBNR");
  const [nameTournament,setNameTournament] = useState("Tournament");
  const [currentGame,setCurrentGame]=useState(0);
  const [currentRound,setCurrentRound]=useState(0);
  const [currentMove,setCurrentMove] = useState(0);
  const [tour,setTour]=useState();
  const [listmoves,setListMoves]=useState([]);
  const [listGame,setListGame] = useState([]);

useEffect(() => {
  console.log("ee1111")
     getJSON().then(function(res){
         setTour(res.data);  
     });
},[]);

useEffect(()=>{
  if(tour){
    setNameTournament(tour.name);
    setFen(tour.rounds[currentRound].games[currentGame].fens[currentMove]);
    extractMoves(tour.rounds[currentRound].games[currentGame].fens);
    exteractListGame();
  }
},[tour]);

  const extractMoves=(datafen)=>{
    let movlist=[];
    for(let i=1;i<datafen.length;i++){
      movlist[i-1] = ChessUtil.getmove(datafen[i-1],datafen[i]);
    }
    setListMoves(movlist);
  }

  const exteractListGame=()=>{
    let list=[];
    for(let i=0;i<tour.rounds.length;i++){
      let contai = [];
      for(let j=0;j<tour.rounds[i].games.length;j++){
        contai.push({
          white:tour.rounds[i].games[j].playwhite,
          black:tour.rounds[i].games[j].playblack
        });
      }
      list.push(contai);
    }
    setListGame(list);
  }

  const drawboard=()=>{
    var dat=[];
    for(let i=7;i>=0;i--){
        for(let j=0;j<8;j++){
            if((i+j)%2===0){
                dat.push(<Rect x={sqsize*j} y={sqsize*i} width={sqsize} height={sqsize} fill='#F0D9B5' />)
            }else{
                dat.push(<Rect x={sqsize*j} y={sqsize*i} width={sqsize} height={sqsize} fill='#B58863' />)
            }
        }
    }
    for(let i=0;i<8;i++){
        dat.push(<Text text={flip ? (i+1):(8-i)} x={sqsize*8 - 14} y={sqsize*i +5} fill={(i%2) ? '#B58863':'#F0D9B5'} /> )
        dat.push(<Text text={String.fromCharCode(flip ? 104-i:i+97 )} x={sqsize*(i+1)-14} y={sqsize*8 -14} fill={(i%2) ? '#B58863':'#F0D9B5'} />)
    }
    return dat;
  }

  const drawPieces=()=>{
    const dat=[];
    for(let i=0;i<64;i++){
      let ch = mainfen.charAt(i)
      if(ch!='-'){
        const imag = new window.Image();
        switch(ch){
            case 'k': imag.src="./Images/bK.png"; break;
            case 'q': imag.src="./Images/bQ.png"; break;
            case 'b': imag.src="./Images/bB.png"; break;
            case 'n': imag.src="./Images/bN.png"; break;
            case 'r': imag.src="./Images/bR.png"; break;
            case 'p': imag.src="./Images/bP.png"; break;
            case 'K': imag.src="./Images/wK.png"; break;
            case 'Q': imag.src="./Images/wQ.png"; break;
            case 'B': imag.src="./Images/wB.png"; break;
            case 'N': imag.src="./Images/wN.png"; break;
            case 'R': imag.src="./Images/wR.png"; break;
            case 'P': imag.src="./Images/wP.png"; break;
        }
        dat.push(<Image 
                  image={imag} 
                  y={parseInt(i/8)*sqsize} 
                  x={parseInt(i%8)*sqsize}
                  width={sqsize}
                  height={sqsize}
                  />)
      }
    }
    return dat;
  }

  const nextMove=()=>{
    let crmove = currentMove+1;
    if(crmove>=tour.rounds[currentRound].games[currentGame].fens.length){
      crmove = tour.rounds[currentRound].games[currentGame].fens.length-1;
    }
    setCurrentMove(crmove);
    setFen(tour.rounds[currentRound].games[currentGame].fens[crmove]);
  }

  const backMove=()=>{
    let crmove = currentMove-1;
    if(crmove<0){
      crmove = 0;
    }
    setCurrentMove(crmove);
    setFen(tour.rounds[currentRound].games[currentGame].fens[crmove]);
  }

  const beginMove=()=>{
    setCurrentMove(0);
    setFen(tour.rounds[currentRound].games[currentGame].fens[0]);
  }
  const endMove=()=>{
    // console.log("endMove");
    let crmove = tour.rounds[currentRound].games[currentGame].fens.length-1;
    setCurrentMove(crmove);
    setFen(tour.rounds[currentRound].games[currentGame].fens[crmove]);
  }

  const nextGame=()=>{
    // console.log("nextGame");
    let numbergame = currentGame+1;
    if(numbergame >=(tour.rounds[currentRound].games.length)) {
      numbergame=0;
    }
    let crmove = tour.rounds[currentRound].games[numbergame].fens.length-1;
    setCurrentGame(numbergame);
    setFen(tour.rounds[currentRound].games[numbergame].fens[crmove]);
    extractMoves(tour.rounds[currentRound].games[numbergame].fens);
    setCurrentMove(crmove);
  }
  const backGame=()=>{
    // console.log("backGame");
    let numbergame = currentGame-1;
    if(numbergame <0) {
      numbergame=(tour.rounds[currentRound].games.length)-1;
    }
    let crmove = tour.rounds[currentRound].games[numbergame].fens.length-1;
    setCurrentGame(numbergame);
    setFen(tour.rounds[currentRound].games[numbergame].fens[crmove]);
    extractMoves(tour.rounds[currentRound].games[numbergame].fens);
    setCurrentMove(crmove);
  }

  const rotateBoard=()=>{
    console.log("rotateBoard");
  }

  const fullScreen=()=>{
    console.log("fullscreen");
  }

  function callmove(number,iswhite){
    let crmove = number+iswhite;
    setCurrentMove(crmove);
    setFen(tour.rounds[currentRound].games[currentGame].fens[crmove]);
  }

  const callSelectedGame=(idround,idgame)=>{    // handler chọn ván game
    console.log("CallSelected:"+idround+" game:"+idgame)
    let crmove = tour.rounds[idround].games[idgame].fens.length-1;
    setCurrentRound(idround);
    setCurrentGame(idgame);
    setFen(tour.rounds[idround].games[idgame].fens[crmove]);
    extractMoves(tour.rounds[idround].games[idgame].fens);
    setCurrentMove(crmove);
  }

    return (
      <div id="mainboard">
        <Header tourname={nameTournament} 
         listgame = {listGame}
         changeselectgame = {callSelectedGame}
         />
        <Stage x={(window.innerWidth-sqsize*8)/2} width={((window.innerWidth-sqsize*8)/2)+sqsize*8} height={sqsize*8} style={{position:'relative',textAlign:'center'}}>
          <Layer>
            {drawboard()}
            {drawPieces()}
          </Layer>
       </Stage>

     <div id="player">
      <div id="playerA">
        <img src="/Icon/emoji-smile.svg" style={{padding:20}}></img>
        <h2>01:34:34</h2>
      </div>
      <div id="playerB">
        <img src="/Icon/emoji-sunglasses.svg" style={{padding:20}}></img>
        <h2>00:35:23</h2>
      </div>
     </div>
    <ViewMoves myonclick={callmove} moves ={listmoves} />

     <div id="tasbar"> 
        <button onClick={()=>beginMove()}><img src="./Icon/skip-backward-fill.svg"/></button>
        <button onClick={()=>backMove()}><img src="./Icon/skip-start-fill.svg"/></button>
        <button onClick={()=>nextMove()}><img src="./Icon/skip-end-fill.svg"/></button>
        <button onClick={()=>endMove()}><img src="./Icon/skip-forward-fill.svg"/></button>
        <button onClick={()=>nextGame()}><img src="./Icon/sort-up.svg"/></button>
        <button onClick={()=>backGame()}><img src="./Icon/sort-down.svg"/></button>
        <button onClick={()=>rotateBoard()}><img src="./Icon/arrow-repeat.svg"/></button>
        <button onClick={()=>fullScreen()}><img src="./Icon/arrows-fullscreen.svg"/></button> 
     </div>
     </div>
    );
}
 
export default Board;



