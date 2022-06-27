import React, { useRef, useState, useEffect, Component } from "react";
import Header from "./Header";
import ViewMoves from "./ViewMoves";
import ChessUtil from "./ChessUtil"
import { initializeApp } from "firebase/app"
import { getDatabase, ref, child, get, onValue } from "firebase/database";

function Board() {
  const firstMove = "rnbqkbnrpppppppp--------------------------------PPPPPPPPRNBQKBNR"
  const [currentFen, setCurrentFen] = useState(firstMove);
  const [currentGame, setCurrentGame] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentMove, setCurrentMove] = useState(0);
  const [tour, setTour] = useState();
  const [listMove, setListMove] = useState([]);
  const [listGame, setListGame] = useState([]);
  const [playerBlack, setPlayerBlack] = useState("");
  const [playerWhite, setPlayerWhite] = useState("");
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
    get(child(dbRef, "Tournaments")).then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val())
        setTour(snapshot.val())
      } else {
        console.log("No data available")
      }
    }).catch((error) => {
      console.error(error)
    })*/

    const baseDbIndex = "ListTour/-N5WSkJ-yqdwA0wAkc41"
    
    new Promise((resolve, reject) => {
      const dbRef = ref(db, baseDbIndex)
      onValue(dbRef, (snapshot) => {
        setTour(snapshot.val())
        console.log(snapshot.val())
        resolve()
      })
    }).then(() => {
      const dbRef2 = ref(db, `${baseDbIndex}/Rounds/${currentRound}/Games/${currentMove}/Fens`)
      onValue(dbRef2, (snapshot) => {
        console.log(snapshot.val())
        setTimeout(function() {
          if (tour !== undefined
                && tour.Rounds[currentRound] !== undefined
                && tour.Rounds[currentRound].Games[currentGame] !== undefined
                && tour.Rounds[currentRound].Games[currentGame].Fens !== undefined) {
              document.getElementById("btn-end-move").click()
            }
        }, 500)
      })
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
    window.addEventListener("keyup", handle);
  }, []);

  useEffect(() => {
    if (tour !== undefined
        && tour.Rounds[currentRound] !== undefined
        && tour.Rounds[currentRound].Games[currentGame] !== undefined) {
      if (tour.Rounds[currentRound].Games[currentGame].Fens !== undefined) {
        extractMoves(tour.Rounds[currentRound].Games[currentGame].Fens);
        if (tour.Rounds[currentRound].Games[currentGame].Fens[currentMove] !== undefined) {
          setCurrentFen(tour.Rounds[currentRound].Games[currentGame].Fens[currentMove]);
        }
      }
      exteractListGame(tour.Rounds);
      setPlayerBlack(bindUserInfo(tour.Rounds[currentRound].Games[currentGame].Black));
      setPlayerWhite(bindUserInfo(tour.Rounds[currentRound].Games[currentGame].White));
      setResult(getResult(tour.Rounds[currentRound].Games[currentGame].resuft));
    }
  }, [tour]);

  const extractMoves = (datafen) => {
    let list = [];
    for (let i = 1; i < datafen.length; i++) {
      if (datafen[i - 1] !== undefined && datafen[i] !== undefined) {
        list[i - 1] = ChessUtil.getmove(datafen[i - 1], datafen[i])
      } else {
        list[i - 1] = "???"
      }
    }
    setListMove(list);
  }

  const exteractListGame = (rounds) => {
    let list = [];
    for (let i = 0; i < rounds.length; i++) {
      let contai = [];
      for (let j = 0; j < rounds[i].Games.length; j++) {
        if (rounds[i].Games[j] !== undefined) {
          contai.push({
            white: rounds[i].Games[j].White.Name,
            black: rounds[i].Games[j].Black.Name,
            result: getResult(rounds[i].Games[j].resuft)
          });
        } else {
          console.error(`Rounds: ${i} - Games: ${j} does not exist.`)
        }

      }
      list.push(contai);
    }
    setListGame(list);
  }

  const drawboard = () => {
    let dat = [];

    let moveDisplay = "";
    let lastFen = "";
    if (currentMove > 0) {
      lastFen = tour.Rounds[currentRound].Games[currentGame].Fens[currentMove - 1];
      moveDisplay = listMove[currentMove - 1];
    }

    let differentFenCharIndex = [];
    if (currentFen !== undefined && lastFen !== undefined
          && currentFen.length === lastFen.length
          && moveDisplay !== "???") {
      for (let i = 0; i < currentFen.length; i++) {
        if (currentFen[i] !== lastFen[i]) {
          differentFenCharIndex.push(i);
        }
      }
    }

    let count = 0;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        let ch = currentFen !== undefined ? currentFen.charAt(count) : ""
        let img = ""
        switch (ch) {
          case "k": img = "/Images/bK.png"; break;
          case "q": img = "/Images/bQ.png"; break;
          case "b": img = "/Images/bB.png"; break;
          case "n": img = "/Images/bN.png"; break;
          case "r": img = "/Images/bR.png"; break;
          case "p": img = "/Images/bP.png"; break;
          case "K": img = "/Images/wK.png"; break;
          case "Q": img = "/Images/wQ.png"; break;
          case "B": img = "/Images/wB.png"; break;
          case "N": img = "/Images/wN.png"; break;
          case "R": img = "/Images/wR.png"; break;
          case "P": img = "/Images/wP.png"; break;
          default: img = ""; break;
        }
        if (img == "") {
          if (differentFenCharIndex.includes(count)) {
            dat.push(<div key={count} className="cell active float-left"><span></span></div>)
          } else {
            if (i % 2 == 0) {
              dat.push(<div key={count} className="cell row-even float-left"><span></span></div>)
            } else {
              dat.push(<div key={count} className="cell row-odd float-left"><span></span></div>)
            }
          }
        } else {
          if (differentFenCharIndex.includes(count)) {
            dat.push(<div key={count} className="cell active float-left"><span><img src={img} /></span></div>)
          } else {
            if (i % 2 == 0) {
              dat.push(<div key={count} className="cell row-even float-left"><span><img src={img} /></span></div>)
            } else {
              dat.push(<div key={count} className="cell row-odd float-left"><span><img src={img} /></span></div>)
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
    setCurrentFen(tour.Rounds[currentRound].Games[currentGame].Fens[crmove]);
  }

  const backMove = () => {
    let crmove = currentMove - 1;
    if (crmove < 0) {
      crmove = 0;
    }
    setCurrentMove(crmove);
    setCurrentFen(tour.Rounds[currentRound].Games[currentGame].Fens[crmove]);
  }

  const beginMove = () => {
    setCurrentMove(0);
    setCurrentFen(tour.Rounds[currentRound].Games[currentGame].Fens[0]);
  }

  const endMove = () => {
    let crmove = tour.Rounds[currentRound].Games[currentGame].Fens.length - 1;
    setCurrentMove(crmove);
    setCurrentFen(tour.Rounds[currentRound].Games[currentGame].Fens[crmove]);
  }

  function goToMove(number, iswhite) {
    let crmove = number + iswhite;
    setCurrentMove(crmove);
    setCurrentFen(tour.Rounds[currentRound].Games[currentGame].Fens[crmove]);
  }

  const callSelectedGame = (idround, idgame) => {
    let crmove = tour.Rounds[idround].Games[idgame].Fens.length - 1;
    setCurrentRound(idround);
    setCurrentGame(idgame);
    setCurrentFen(tour.Rounds[idround].Games[idgame].Fens[crmove]);
    extractMoves(tour.Rounds[idround].Games[idgame].Fens);
    setCurrentMove(crmove);
    setPlayerBlack(bindUserInfo(tour.Rounds[idround].Games[idgame].Black));
    setPlayerWhite(bindUserInfo(tour.Rounds[idround].Games[idgame].White));
    setResult(getResult(tour.Rounds[idround].Games[idgame].resuft));
  }

  return (
    <div id="mainboard">
      <Header
        tourName={tour !== undefined && tour.Name !== undefined ? tour.Name : ""}
        tourDate={tour !== undefined && tour.Date !== undefined ? tour.Date : ""}
        listGame={listGame}
        changeselectgame={callSelectedGame}
      />

      <main id="content" className="content clearfix">
        <div className="content-left float-left">
          <div className="player">
            <div className="player-wrapper text-center">
              <img src={playerBlack.avatar} alt={playerBlack.fullName} className="avatar" />
              <p className="fullname">{playerBlack.fullName}</p>
              <div className="secondary">
                <img src={playerBlack.national} alt="" className="national" align="center" />
                {/* <span className="score">2048</span> */}
              </div>
              <div className="time">
                <span>--:--:--</span>
              </div>
            </div>
            <div className="main-score text-center">{result[1]}</div>
          </div>
          <div className="player text-center">
            <div className="player-wrapper text-center">
              <div className="time">
                <span>--:--:--</span>
              </div>
              <img src={playerWhite.avatar} alt={playerWhite.fullName} className="avatar" />
              <p className="fullname">{playerWhite.fullName}</p>
              <div className="secondary">
                <img src={playerWhite.national} alt="" className="national" align="center" />
                {/* <span className="score">2048</span> */}
              </div>
            </div>
            <div className="main-score text-center">{result[0]}</div>
          </div>
        </div>
        <div className="content-center float-left">
          <div className="wrapper">
            <div className="board">
              <div className="player clearfix">
                <div className="avatar float-left">
                  <img src={playerBlack.avatar} alt={playerBlack.fullName} />
                </div>
                <div className="main-info">
                  <p className="fullname">{playerBlack.fullName}</p>
                  <img src={playerBlack.national} alt="" className="national" />
                </div>
              </div>
              <div className="board-wrapper" style={{ backgroundImage: `url('/Images/board-bg.jpg')` }}>
                <div className="board-content">
                  {drawboard()}
                </div>
              </div>
              <div className="player clearfix">
                <div className="avatar float-left">
                  <img src={playerWhite.avatar} alt={playerWhite.fullName} />
                </div>
                <div className="main-info">
                  <p className="fullname">{playerWhite.fullName}</p>
                  <img src={playerWhite.national} alt="" className="national" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-right float-left">
          <ViewMoves goToMove={goToMove} moves={listMove} currentMove={currentMove} />

          <p className="score text-center">{result[0]} - {result[1]}</p>
          <div className="list-function text-center clearfix">
            <div className="item float-left">
              <button type="button" id="btn-begin-move" onClick={() => beginMove()}><i className="fas fa-fast-backward"></i></button>
            </div>
            <div className="item float-left">
              <button type="button" id="btn-back-move" onClick={() => backMove()}><i className="fas fa-caret-left"></i></button>
            </div>
            <div className="item float-left">
              <span className="current-state">{currentMove === listMove.length ? "Live" : listMove[currentMove - 1]}</span>
            </div>
            <div className="item float-left">
              <button type="button" id="btn-next-move" onClick={() => nextMove()}><i className="fas fa-caret-right"></i></button>
            </div>
            <div className="item float-left">
              <button type="button" id="btn-end-move" onClick={() => endMove()}><i className="fas fa-fast-forward"></i></button>
            </div>
          </div>
        </div>
      </main>
      <footer id="footer">
        <div className="list-function text-center clearfix">
          <div className="item float-left">
            <button type="button" onClick={() => beginMove()}><i className="fas fa-fast-backward"></i></button>
          </div>
          <div className="item float-left">
            <button type="button" onClick={() => backMove()}><i className="fas fa-caret-left"></i></button>
          </div>
          <div className="item float-left">
            <span className="current-state">{currentMove === listMove.length ? "Live" : listMove[currentMove - 1]}</span>
          </div>
          <div className="item float-left">
            <button type="button" onClick={() => nextMove()}><i className="fas fa-caret-right"></i></button>
          </div>
          <div className="item float-left">
            <button type="button" onClick={() => endMove()}><i className="fas fa-fast-forward"></i></button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function bindUserInfo(data) {
  let userInfo = {
    fullName: data.Name !== undefined ? data.Name : "",
    avatar: "/Images/avatar/default-avatar.jpg",
    national: "/Images/flag/default-flag.jpg"
  }

  switch (data.Address) {
    case "VIETNAM":
    case "VNM":
      userInfo.national = "/Images/flag/vietnam.jpg"
      break
    case "UKR":
      userInfo.national = "/Images/flag/ukraine.jpg"
      break
    default:
      break
  }

  switch (data.FideId) {
    case "12424714":
      userInfo.avatar = "/Images/avatar/banh-gia-huy.jpg"
      break
    case "12424722":
      userInfo.avatar = "/Images/avatar/dau-khuong-duy.jpg"
      break
    case "12424730":
      userInfo.avatar = "/Images/avatar/dinh-nho-kiet.jpg"
      break
    case "12403547":
      userInfo.avatar = "/Images/avatar/doan-thi-hong-nhung.jpg"
      break
    case "12407135":
      userInfo.avatar = "/Images/avatar/hoang-thi-hai-anh.jpg"
      break
    case "12409910":
      userInfo.avatar = "/Images/avatar/kieu-bich-thuy.jpg"
      break
    case "12414816":
      userInfo.avatar = "/Images/avatar/nguyen-thien-ngan.jpg"
      break
    case "12407925":
      userInfo.avatar = "/Images/avatar/tran-dang-minh-quang.jpg"
      break
    case "14101254":
      userInfo.avatar = "/Images/avatar/vasilyev-mikhail.jpg"
      break
    case "12414697":
      userInfo.avatar = "/Images/avatar/luong-hoang-tu-linh.jpg"
      break
    case "12411248":
      userInfo.avatar = "/Images/avatar/pham-cong-minh.jpg"
      break
    default:
      break
  }

  return userInfo
}

function getResult(result) {
  if (result === undefined) {
    return ["0", "0"];
  }
  return result.split("-");
}

export default Board;
