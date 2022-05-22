import React, { useRef, useState, useEffect, Component } from 'react';
import { Stage, Rect, Layer, Circle, Text, Image } from 'react-konva';
import Header from './Header';
import ViewMoves from './ViewMoves';
import axios from 'axios';
import ChessUtil from './ChessUtil'

function getJSON() {
  let url = new URL(window.location.href);
  let id = url.searchParams.get("id");
  console.log("param:" + id);
  var urldatabase = "http://localhost:5000/tournament?id=" + id;
  // To make the function blocking we manually create a Promise.
  return new Promise(function (resolve) {
    axios.get(urldatabase)
      .then(function (json) {
        // The data from the request is available in a .then block
        // We return the result using resolve.
        resolve(json);
      });
  });
}

function Board() {
  const [mainfen, setFen] = useState("rnbqkbnrpppppppp--------------------------------PPPPPPPPRNBQKBNR");
  const [nameTournament, setNameTournament] = useState("Tournament");
  const [currentGame, setCurrentGame] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentMove, setCurrentMove] = useState(0);
  const [tour, setTour] = useState();
  const [listmoves, setListMoves] = useState([]);
  const [listGame, setListGame] = useState([]);

  useEffect(() => {
    console.log("ee1111")
    getJSON().then(function (res) {
      setTour(res.data);
    });

    const handle = (event) => {
      switch (event.keyCode) {
        case 37:
          document.getElementById("btn-back-move").click();
          break;
        case 38:
          document.getElementById("btn-begin-move").click();
          break;
        case 39:
          document.getElementById("btn-next-move").click();
          break;
        case 40:
          document.getElementById("btn-end-move").click();
          break;
        default:
          break;
      }
    };
    window.addEventListener('keyup', handle);
  }, []);

  useEffect(() => {
    if (tour) {
      setNameTournament(tour.name);
      setFen(tour.rounds[currentRound].games[currentGame].fens[currentMove]);
      extractMoves(tour.rounds[currentRound].games[currentGame].fens);
      exteractListGame();
    }
  }, [tour]);

  const extractMoves = (datafen) => {
    let movlist = [];
    for (let i = 1; i < datafen.length; i++) {
      movlist[i - 1] = ChessUtil.getmove(datafen[i - 1], datafen[i]);
    }
    setListMoves(movlist);
  }

  const exteractListGame = () => {
    let list = [];
    for (let i = 0; i < tour.rounds.length; i++) {
      let contai = [];
      for (let j = 0; j < tour.rounds[i].games.length; j++) {
        contai.push({
          white: tour.rounds[i].games[j].playwhite,
          black: tour.rounds[i].games[j].playblack
        });
      }
      list.push(contai);
    }
    setListGame(list);
  }

  const drawboard = () => {
    var dat = [];

    let moveDisplay = '';
    let lastFen = '';
    if (currentMove > 0) {
      lastFen = tour.rounds[currentRound].games[currentGame].fens[currentMove - 1];
      moveDisplay = listmoves[currentMove - 1];
    }

    let differentFenCharIndex = [];
    if (mainfen.length === lastFen.length && moveDisplay !== '???') {
      for (let i = 0; i < mainfen.length; i++) {
        if (mainfen[i] !== lastFen[i]) {
          differentFenCharIndex.push(i);
        }
      }
    }

    let count = 0;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        let ch = mainfen.charAt(count)
        let img = ''
        switch (ch) {
          case 'k': img = "/Images/bK.png"; break;
          case 'q': img = "/Images/bQ.png"; break;
          case 'b': img = "/Images/bB.png"; break;
          case 'n': img = "/Images/bN.png"; break;
          case 'r': img = "/Images/bR.png"; break;
          case 'p': img = "/Images/bP.png"; break;
          case 'K': img = "/Images/wK.png"; break;
          case 'Q': img = "/Images/wQ.png"; break;
          case 'B': img = "/Images/wB.png"; break;
          case 'N': img = "/Images/wN.png"; break;
          case 'R': img = "/Images/wR.png"; break;
          case 'P': img = "/Images/wP.png"; break;
          default: img = ''; break;
        }
        if (img == '') {
          if (differentFenCharIndex.includes(count)) {
            dat.push(<div class="cell active float-left"><span></span></div>)
          } else {
            if (i % 2 == 0) {
              dat.push(<div class="cell row-even float-left"><span></span></div>)
            } else {
              dat.push(<div class="cell row-odd float-left"><span></span></div>)
            }
          }
        } else {
          if (differentFenCharIndex.includes(count)) {
            dat.push(<div class="cell active float-left"><span><img src={img} /></span></div>)
          } else {
            if (i % 2 == 0) {
              dat.push(<div class="cell row-even float-left"><span><img src={img} /></span></div>)
            } else {
              dat.push(<div class="cell row-odd float-left"><span><img src={img} /></span></div>)
            }
          }
        }
        count++;
      }
    }
    return dat;
  }

  const nextMove = () => {
    let crmove = currentMove + 1;
    if (crmove >= tour.rounds[currentRound].games[currentGame].fens.length) {
      crmove = tour.rounds[currentRound].games[currentGame].fens.length - 1;
    }
    setCurrentMove(crmove);
    setFen(tour.rounds[currentRound].games[currentGame].fens[crmove]);
  }

  const backMove = () => {
    let crmove = currentMove - 1;
    if (crmove < 0) {
      crmove = 0;
    }
    setCurrentMove(crmove);
    setFen(tour.rounds[currentRound].games[currentGame].fens[crmove]);
  }

  const beginMove = () => {
    setCurrentMove(0);
    setFen(tour.rounds[currentRound].games[currentGame].fens[0]);
  }

  const endMove = () => {
    // console.log("endMove");
    let crmove = tour.rounds[currentRound].games[currentGame].fens.length - 1;
    setCurrentMove(crmove);
    setFen(tour.rounds[currentRound].games[currentGame].fens[crmove]);
  }

  const nextGame = () => {
    // console.log("nextGame");
    let numbergame = currentGame + 1;
    if (numbergame >= (tour.rounds[currentRound].games.length)) {
      numbergame = 0;
    }
    let crmove = tour.rounds[currentRound].games[numbergame].fens.length - 1;
    setCurrentGame(numbergame);
    setFen(tour.rounds[currentRound].games[numbergame].fens[crmove]);
    extractMoves(tour.rounds[currentRound].games[numbergame].fens);
    setCurrentMove(crmove);
  }

  const backGame = () => {
    // console.log("backGame");
    let numbergame = currentGame - 1;
    if (numbergame < 0) {
      numbergame = (tour.rounds[currentRound].games.length) - 1;
    }
    let crmove = tour.rounds[currentRound].games[numbergame].fens.length - 1;
    setCurrentGame(numbergame);
    setFen(tour.rounds[currentRound].games[numbergame].fens[crmove]);
    extractMoves(tour.rounds[currentRound].games[numbergame].fens);
    setCurrentMove(crmove);
  }

  function callmove(number, iswhite) {
    let crmove = number + iswhite;
    setCurrentMove(crmove);
    setFen(tour.rounds[currentRound].games[currentGame].fens[crmove]);
  }

  const callSelectedGame = (idround, idgame) => {    // handler chọn ván game
    console.log("CallSelected:" + idround + " game:" + idgame)
    let crmove = tour.rounds[idround].games[idgame].fens.length - 1;
    setCurrentRound(idround);
    setCurrentGame(idgame);
    setFen(tour.rounds[idround].games[idgame].fens[crmove]);
    extractMoves(tour.rounds[idround].games[idgame].fens);
    setCurrentMove(crmove);
  }

  return (
    <div id="mainboard">
      <Header tourname={nameTournament}
        listgame={listGame}
        changeselectgame={callSelectedGame}
      />

      <main id="content" class="content clearfix">
        <div class="content-left float-left">
          <div class="player">
            <div class="player-wrapper text-center">
              <img src="/Images/player-1.jpg" alt="Ervan, Mohamard" class="avatar" />
              <p class="fullname">Ervan, Mohamard</p>
              <div class="secondary">
                <img src="/Images/flag.jpg" alt="United Kingdom" class="national" align="center" />
                <span class="score">2048</span>
              </div>
              <div class="time">
                <span>1:33:07</span>
              </div>
            </div>
            <div class="main-score text-center">1/2</div>
          </div>
          <div class="player text-center">
            <div class="player-wrapper text-center">
              <div class="time">
                <span>1:30:40</span>
              </div>
              <img src="/Images/player-2.jpg" alt="Ervan, Mohamard" class="avatar" />
              <p class="fullname">Tran Tuan Minh</p>
              <div class="secondary">
                <img src="/Images/flag.jpg" alt="United Kingdom" class="national" align="center" />
                <span class="score">2048</span>
              </div>
            </div>
            <div class="main-score text-center">1/2</div>
          </div>
        </div>
        <div class="content-center float-left">
          <div class="wrapper">
            <div class="board">
              <div class="board-wrapper" style={{ backgroundImage: `url('/Images/board-bg.jpg')` }}>
                <div class="board-content">
                  {drawboard()}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content-right float-left">
          <ViewMoves myonclick={callmove} moves={listmoves} currentMove={currentMove} />

          <p class="score text-center">0 - 1</p>
          <div class="function text-center clearfix">
            <div class="item float-left">
              <button type="button" id="btn-begin-move" onClick={() => beginMove()}><i class="fas fa-fast-backward"></i></button>
            </div>
            <div class="item float-left">
              <button type="button" id="btn-back-move" onClick={() => backMove()}><i class="fas fa-caret-left"></i></button>
            </div>
            <div class="item float-left">
              <span class="current-state">{currentMove === listmoves.length ? 'Live' : listmoves[currentMove - 1]}</span>
            </div>
            <div class="item float-left">
              <button type="button" id="btn-next-move" onClick={() => nextMove()}><i class="fas fa-caret-right"></i></button>
            </div>
            <div class="item float-left">
              <button type="button" id="btn-end-move" onClick={() => endMove()}><i class="fas fa-fast-forward"></i></button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Board;
