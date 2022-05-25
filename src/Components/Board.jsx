import React, { useRef, useState, useEffect, Component } from 'react';
import Header from './Header';
import ViewMoves from './ViewMoves';
import ChessUtil from './ChessUtil'
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, child, get, onValue } from "firebase/database";

function Board() {
  const [mainfen, setFen] = useState("rnbqkbnrpppppppp--------------------------------PPPPPPPPRNBQKBNR");
  const [currentGame, setCurrentGame] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentMove, setCurrentMove] = useState(0);
  const [tour, setTour] = useState();
  const [listmoves, setListMoves] = useState([]);
  const [listGame, setListGame] = useState([]);
  const [playerBlack, setPlayerBlack] = useState('');
  const [playerWhite, setPlayerWhite] = useState('');
  const [result, setResult] = useState([0,0]);

  useEffect(() => {
    const firebaseConfig = {
      apiKey: "AIzaSyClxIjgGdpMGF3HcHMnydonZe24q2V5Qzc",
      authDomain: "testrealtime-5579d.firebaseapp.com",
      databaseURL: "https://testrealtime-5579d-default-rtdb.firebaseio.com",
      projectId: "testrealtime-5579d",
      storageBucket: "testrealtime-5579d.appspot.com",
      messagingSenderId: "819449395660",
      appId: "1:819449395660:web:ea00022b41357579a34569",
      measurementId: "G-PNTXWVRBVP"
    };
    const app = initializeApp(firebaseConfig)
    const db = getDatabase(app)

    /*const dbRef = ref(db)
    get(child(dbRef, 'Tournaments')).then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val())
        setTour(snapshot.val())
      } else {
        console.log("No data available")
      }
    }).catch((error) => {
      console.error(error)
    })*/

    const dbRef = ref(db, 'Tournament')
    onValue(dbRef, (snapshot) => {
      setTour(snapshot.val())
      console.log(snapshot.val())
    })

    const dbRef2 = ref(db, `Tournament/Rounds/${currentRound}/Games/${currentMove}/Fens`)
    onValue(dbRef2, (snapshot) => {
      console.log(snapshot.val())
      setTimeout(function() {
        document.getElementById("btn-end-move").click()
      }, 500)
    })

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
      setFen(tour.Rounds[currentRound].Games[currentGame].Fens[currentMove]);
      extractMoves(tour.Rounds[currentRound].Games[currentGame].Fens);
      exteractListGame();
      setPlayerBlack(getUserInfoByFullName(tour.Rounds[currentRound].Games[currentGame].Black));
      setPlayerWhite(getUserInfoByFullName(tour.Rounds[currentRound].Games[currentGame].White));
      setResult(getResult(tour.Rounds[currentRound].Games[currentGame].resuft));
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
    for (let i = 0; i < tour.Rounds.length; i++) {
      let contai = [];
      for (let j = 0; j < tour.Rounds[i].Games.length; j++) {
        contai.push({
          white: tour.Rounds[i].Games[j].White,
          black: tour.Rounds[i].Games[j].Black,
          result: getResult(tour.Rounds[i].Games[j].resuft)
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
      lastFen = tour.Rounds[currentRound].Games[currentGame].Fens[currentMove - 1];
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
    if (crmove >= tour.Rounds[currentRound].Games[currentGame].Fens.length) {
      crmove = tour.Rounds[currentRound].Games[currentGame].Fens.length - 1;
    }
    setCurrentMove(crmove);
    setFen(tour.Rounds[currentRound].Games[currentGame].Fens[crmove]);
  }

  const backMove = () => {
    let crmove = currentMove - 1;
    if (crmove < 0) {
      crmove = 0;
    }
    setCurrentMove(crmove);
    setFen(tour.Rounds[currentRound].Games[currentGame].Fens[crmove]);
  }

  const beginMove = () => {
    setCurrentMove(0);
    setFen(tour.Rounds[currentRound].Games[currentGame].Fens[0]);
  }

  const endMove = () => {
    // console.log("endMove");
    let crmove = tour.Rounds[currentRound].Games[currentGame].Fens.length - 1;
    setCurrentMove(crmove);
    setFen(tour.Rounds[currentRound].Games[currentGame].Fens[crmove]);
  }

  function callmove(number, iswhite) {
    let crmove = number + iswhite;
    setCurrentMove(crmove);
    setFen(tour.Rounds[currentRound].Games[currentGame].Fens[crmove]);
  }

  const callSelectedGame = (idround, idgame) => {    // handler chọn ván game
    console.log("CallSelected:" + idround + " game:" + idgame)
    let crmove = tour.Rounds[idround].Games[idgame].Fens.length - 1;
    setCurrentRound(idround);
    setCurrentGame(idgame);
    setFen(tour.Rounds[idround].Games[idgame].Fens[crmove]);
    extractMoves(tour.Rounds[idround].Games[idgame].Fens);
    setCurrentMove(crmove);
    setPlayerBlack(getUserInfoByFullName(tour.Rounds[idround].Games[idgame].Black));
    setPlayerWhite(getUserInfoByFullName(tour.Rounds[idround].Games[idgame].White));
    setResult(getResult(tour.Rounds[idround].Games[idgame].resuft));
  }

  return (
    <div id="mainboard">
      <Header
        listgame={listGame}
        changeselectgame={callSelectedGame}
      />

      <main id="content" class="content clearfix">
        <div class="content-left float-left">
          <div class="player">
            <div class="player-wrapper text-center">
              <img src={playerBlack.avatar} alt={playerBlack.fullName} class="avatar" />
              <p class="fullname">{playerBlack.fullName}</p>
              <div class="secondary">
                <img src={playerBlack.national} alt="" class="national" align="center" />
                {/* <span class="score">2048</span> */}
              </div>
              <div class="time">
                <span>--:--:--</span>
              </div>
            </div>
            <div class="main-score text-center">{result[1]}</div>
          </div>
          <div class="player text-center">
            <div class="player-wrapper text-center">
              <div class="time">
                <span>--:--:--</span>
              </div>
              <img src={playerWhite.avatar} alt={playerWhite.fullName} class="avatar" />
              <p class="fullname">{playerWhite.fullName}</p>
              <div class="secondary">
                <img src={playerWhite.national} alt="" class="national" align="center" />
                {/* <span class="score">2048</span> */}
              </div>
            </div>
            <div class="main-score text-center">{result[0]}</div>
          </div>
        </div>
        <div class="content-center float-left">
          <div class="wrapper">
            <div class="board">
              <div class="player clearfix">
                <div class="avatar float-left">
                  <img src={playerBlack.avatar} alt={playerBlack.fullName} />
                </div>
                <div class="main-info">
                  <p class="fullname">{playerBlack.fullName}</p>
                  <img src={playerBlack.national} alt="" class="national" />
                </div>
              </div>
              <div class="board-wrapper" style={{ backgroundImage: `url('/Images/board-bg.jpg')` }}>
                <div class="board-content">
                  {drawboard()}
                </div>
              </div>
              <div class="player clearfix">
                <div class="avatar float-left">
                  <img src={playerWhite.avatar} alt={playerWhite.fullName} />
                </div>
                <div class="main-info">
                  <p class="fullname">{playerWhite.fullName}</p>
                  <img src={playerWhite.national} alt="" class="national" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content-right float-left">
          <ViewMoves myonclick={callmove} moves={listmoves} currentMove={currentMove} />

          <p class="score text-center">{result[0]} - {result[1]}</p>
          <div class="list-function text-center clearfix">
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
      <footer id="footer">
        <div class="list-function text-center clearfix">
          <div class="item float-left">
            <button type="button" onClick={() => beginMove()}><i class="fas fa-fast-backward"></i></button>
          </div>
          <div class="item float-left">
            <button type="button" onClick={() => backMove()}><i class="fas fa-caret-left"></i></button>
          </div>
          <div class="item float-left">
            <span class="current-state">{currentMove === listmoves.length ? 'Live' : listmoves[currentMove - 1]}</span>
          </div>
          <div class="item float-left">
            <button type="button" onClick={() => nextMove()}><i class="fas fa-caret-right"></i></button>
          </div>
          <div class="item float-left">
            <button type="button" onClick={() => endMove()}><i class="fas fa-fast-forward"></i></button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function getUserInfoByFullName(fullName) {
  let userInfo = {
    fullName: fullName,
    avatar: '/Images/avatar/default-avatar.jpg',
    national: '/Images/flag/vietnam.jpg'
  }
  switch (userInfo.fullName) {
    case 'Nguyen Anh Dung':
      userInfo.avatar = '/Images/avatar/nguyen-anh-dung.jpg';
      userInfo.national = '/Images/flag/vietnam.jpg';
      break;
    case 'Pranav Anand':
      userInfo.avatar = '/Images/avatar/pranav-anand.jpg';
      userInfo.national = '/Images/flag/indian.jpg';
      break;
    case 'Nguyen Van Huy':
      userInfo.avatar = '/Images/avatar/nguyen-van-huy.jpg';
      userInfo.national = '/Images/flag/vietnam.jpg';
      break;
    case 'Bersamina Paulo':
      userInfo.avatar = '/Images/avatar/bersamina-paulo.jpg';
      userInfo.national = '/Images/flag/philippin.jpg';
      break;
    case 'Quizon Daniel':
      userInfo.avatar = '/Images/avatar/quizon-daniel.jpg';
      userInfo.national = '/Images/flag/philippin.jpg';
      break;
    case 'Setyaki Azarya Jodi':
      userInfo.avatar = '/Images/avatar/setyaki-azarya-jodi.jpg';
      userInfo.national = '/Images/flag/indonesia.jpg';
      break;
    case 'Tin Jingyao':
      userInfo.avatar = '/Images/avatar/tin-jingyao.jpg';
      userInfo.national = '/Images/flag/singapore.jpg';
      break;
    case 'Tran Tuan Minh':
      userInfo.avatar = '/Images/avatar/tran-tuan-minh.jpg';
      userInfo.national = '/Images/flag/vietnam.jpg';
      break;
    case 'Tran Minh Thang':
      userInfo.avatar = '/Images/avatar/tran-minh-thang.jpg';
      userInfo.national = '/Images/flag/vietnam.jpg';
      break;
    case 'Dang Hoang Son':
      userInfo.avatar = '/Images/avatar/dang-hoang-son.jpg';
      userInfo.national = '/Images/flag/vietnam.jpg';
      break;
    default:
      break;
  }

  return userInfo
}

function getResult(result) {
  return result.split('-');
}

export default Board;
