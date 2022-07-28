
import React, { useRef, useState, useEffect, Component } from "react"
import Header from "./Header"
import ViewMoves from "./ViewMoves"
import ChessUtil from "./ChessUtil"
import { initializeApp } from "firebase/app"
import { getDatabase, ref, child, get, onValue } from "firebase/database"
import axios from "axios"

function Board() {
  const firstMove = "rnbqkbnrpppppppp--------------------------------PPPPPPPPRNBQKBNR"
  const [currentFen, setCurrentFen] = useState(firstMove)
  const [currentGame, setCurrentGame] = useState(0)
  const [currentRound, setCurrentRound] = useState(0)
  const [currentMove, setCurrentMove] = useState(0)
  const [tour, setTour] = useState()
  const [listFen, setListFen] = useState([])
  const [listMove, setListMove] = useState([])
  const [listGame, setListGame] = useState([])
  const [playerBlack, setPlayerBlack] = useState({
    fullName: "",
    avatar: "/Images/avatar/default-avatar.jpg",
    national: "/Images/flag/default-flag.jpg"
  })
  const [playerWhite, setPlayerWhite] = useState({
    fullName: "",
    avatar: "/Images/avatar/default-avatar.jpg",
    national: "/Images/flag/default-flag.jpg"
  })
  const [result, setResult] = useState(["0", "0"])
  const [clockBlack, setClockBlack] = useState("--:--:--")
  const [clockWhite, setClockWhite] = useState("--:--:--")

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
    }
    const app = initializeApp(firebaseConfig)
    const db = getDatabase(app)

    // let a = "-r-qk--r---nkppp----p------pP---Pp-P--------BN---P---PPPR--Q-RK-"
    // let b = "-r-qk--r---nbppp--B-p------pP---Pp-P--------BN---P---PPPR--Q-RK-"
    // console.log(ChessUtil.getmove(a, b))

    const baseDbIndex = "ListTournaments"
    const dbRef = ref(db)
    new Promise((resolve, reject) => {
      get(child(dbRef, baseDbIndex)).then((snapshot) => {
        let listTour = snapshot.val()
        let tourId = getQueryString("tourId") || ""
        if (tourId !== "") {
          if (listTour[tourId] !== undefined) {
            if (listTour[tourId].RoundRuning !== undefined && listTour[tourId].Rounds !== undefined && listTour[tourId].RoundRuning > 0 && listTour[tourId].RoundRuning <= listTour[tourId].Rounds.length) {
              setCurrentRound(listTour[tourId].RoundRuning - 1)
            }
            resolve(tourId)
          }
        } else {
          for (const [key, value] of Object.entries(listTour)) {
            if (value.RoundRuning !== undefined && value.Rounds !== undefined && value.RoundRuning > 0 && value.RoundRuning <= value.Rounds.length) {
              setCurrentRound(value.RoundRuning - 1)
            }
            resolve(key)
            break
          }
        }
      }).catch((error) => {
        console.error(error)
      })
    }).then((tourId) => {
      const dbRef2 = ref(db, `${baseDbIndex}/${tourId}`)
      onValue(dbRef2, (snapshot) => {
        try {
          let tour = snapshot.val()
          console.log(tour)
          setTour(tour)
          // let listFen = bindListFen(tour.Rounds[currentRound].Games[currentGame].Movelist)
          // setListFen(listFen)
          // let listMove = bindListMove(tour.Rounds[currentRound].Games[currentGame].Movelist)
          // setListMove(listMove)
          setTimeout(function() {
            document.getElementById("btn-end-move").click()
          }, 500)
        } catch (err) {
          console.error(err)
        }
      })
    })
    
    const handle = (event) => {
      switch (event.keyCode) {
        case 37:
          document.getElementById("btn-back-move").click()
          break
        case 38:
          document.getElementById("btn-begin-move").click()
          break
        case 39:
          document.getElementById("btn-next-move").click()
          break
        case 40:
          document.getElementById("btn-end-move").click()
          break
        default:
          break
      }
    }
    window.addEventListener("keyup", handle)
  }, [])

  useEffect(() => {
    if (tour !== undefined) {
      try {
        let listFen = bindListFen(tour.Rounds[currentRound].Games[currentGame].Movelist)
        setListFen(listFen)
        setListMove(bindListMove(tour.Rounds[currentRound].Games[currentGame].Movelist))
        setCurrentFen(listFen[currentMove])
      } catch (err) {
        console.error(err)
      }

      try {
        setPlayerBlack(bindUserInfo(tour.Rounds[currentRound].Games[currentGame].BlackPlayer))
      } catch (err) {
        console.error(err)
      }

      try {
        setClockBlack(bindClock(tour.Rounds[currentRound].Games[currentGame].BlackClock))
      } catch (err) {
        console.error(err)
      }
      // setClockBlack("--:--:--")

      try {
        setPlayerWhite(bindUserInfo(tour.Rounds[currentRound].Games[currentGame].WhitePlayer))
      } catch (err) {
        console.error(err)
      }

      try {
        setClockWhite(bindClock(tour.Rounds[currentRound].Games[currentGame].WhiteClock))
      } catch (err) {
        console.error(err)
      }
      // setClockWhite("--:--:--")

      try {
        setResult(bindResult(tour.Rounds[currentRound].Games[currentGame].Resuft))
      } catch (err) {
        console.error(err)
      }

      try {
        let listGame = bindListGame(tour.Rounds)
        setListGame(listGame)
      } catch (err) {
        console.error(err)
      }
    }
  }, [tour])

  const drawboard = () => {
    let dat = []

    let moveDisplay = ""
    let lastFen = ""
    if (currentMove > 0) {
      lastFen = listFen[currentMove - 1]
      moveDisplay = listMove[currentMove - 1]
    }

    let differentFenCharIndex = []
    if (currentFen !== undefined && lastFen !== undefined
          && currentFen.length === lastFen.length
          && moveDisplay !== "???") {
      for (let i = 0; i < currentFen.length; i++) {
        if (currentFen[i] !== lastFen[i]) {
          differentFenCharIndex.push(i)
        }
      }
    }

    let count = 0
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        let ch = currentFen !== undefined ? currentFen.charAt(count) : ""
        let img = ""
        switch (ch) {
          case "k":
            img = "/Images/bK.png"
            break
          case "q": 
            img = "/Images/bQ.png"
            break
          case "b":
            img = "/Images/bB.png"
            break
          case "n":
            img = "/Images/bN.png"
            break
          case "r":
            img = "/Images/bR.png"
            break
          case "p":
            img = "/Images/bP.png"
            break
          case "K":
            img = "/Images/wK.png"
            break
          case "Q":
            img = "/Images/wQ.png"
            break
          case "B":
            img = "/Images/wB.png"
            break
          case "N":
            img = "/Images/wN.png"
            break
          case "R":
            img = "/Images/wR.png"
            break
          case "P":
            img = "/Images/wP.png"
            break
          default:
            img = ""
            break
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
        count++
      }
    }
    return dat
  }

  const nextMove = () => {
    let crmove = currentMove + 1
    if (crmove >= listFen.length) {
      crmove = listFen.length - 1
    }
    setCurrentMove(crmove)
    // if (listMove.length > 1) {
    //   let move = JSON.parse(listMove[crmove - 1])
    //   if (move.Side === 1) {
    //     setClockWhite(move.Clock)
    //     setClockBlack("--:--:--")
    //   }
    //   if (move.Side === 2) {
    //     setClockWhite("--:--:--")
    //     setClockBlack(move.Clock)
    //   }
    // }
    setCurrentFen(listFen[crmove])
  }

  const backMove = () => {
    let crmove = currentMove - 1
    if (crmove < 0) {
      crmove = 0
    }
    setCurrentMove(crmove)
    // if (crmove > 0) {
    //   if (listMove.length > 1) {
    //     let move = JSON.parse(listMove[crmove - 1])
    //     if (move.Side === 1) {
    //       setClockWhite(move.Clock)
    //       setClockBlack("--:--:--")
    //     }
    //     if (move.Side === 2) {
    //       setClockWhite("--:--:--")
    //       setClockBlack(move.Clock)
    //     }
    //   }
    // } else {
    //   setClockWhite("--:--:--")
    //   setClockBlack("--:--:--")
    // }
    setCurrentFen(listFen[crmove])
  }

  const beginMove = () => {
    setCurrentMove(0)
    // setClockWhite("--:--:--")
    // setClockBlack("--:--:--")
    setCurrentFen(listFen[0])
  }

  const endMove = () => {
    let crmove = listFen.length - 1
    setCurrentMove(crmove)
    // if (listMove.length > 1) {
    //   let move = JSON.parse(listMove[crmove - 1])
    //   if (move.Side === 1) {
    //     setClockWhite(move.Clock)
    //     setClockBlack("--:--:--")
    //   }
    //   if (move.Side === 2) {
    //     setClockWhite("--:--:--")
    //     setClockBlack(move.Clock)
    //   }
    // }
    setCurrentFen(listFen[crmove])
  }

  const goToMove = (number, isWhite) => {
    let crmove = number + isWhite
    setCurrentMove(crmove)
    // if (listMove.length > 1) {
    //   let move = JSON.parse(listMove[crmove - 1])
    //   if (move.Side === 1) {
    //     setClockWhite(move.Clock)
    //     setClockBlack("--:--:--")
    //   }
    //   if (move.Side === 2) {
    //     setClockWhite("--:--:--")
    //     setClockBlack(move.Clock)
    //   }
    // }
    setCurrentFen(listFen[crmove])
  }

  const callSelectedGame = (idround, idgame) => {
    setListFen([])
    setListMove([])
    // setCurrentFen()
    // setCurrentMove(0)
    setPlayerWhite(bindUserInfo())
    setClockWhite("--:--:--")
    setPlayerBlack(bindUserInfo())
    setClockBlack("--:--:--")
    setResult(["0", "0"])

    try {
      let listFen = bindListFen(tour.Rounds[idround].Games[idgame].Movelist)
      setListFen(listFen)
      setListMove(bindListMove(tour.Rounds[idround].Games[idgame].Movelist))
      let crmove = listFen.length - 1
      setCurrentFen(listFen[crmove])
      setCurrentMove(crmove)
    } catch (err) {
      console.error(err)
    }

    try {
      setClockWhite(bindClock(tour.Rounds[idround].Games[idgame].WhiteClock))
    } catch (err) {
      console.error(err)
    }
    // setClockWhite("--:--:--")

    try {
      setPlayerWhite(bindUserInfo(tour.Rounds[idround].Games[idgame].WhitePlayer))
    } catch (err) {
      console.error(err)
    }

    try {
      setPlayerBlack(bindUserInfo(tour.Rounds[idround].Games[idgame].BlackPlayer))
    } catch (err) {
      console.error(err)
    }

    try {
      setClockBlack(bindClock(tour.Rounds[idround].Games[idgame].BlackClock))
    } catch (err) {
      console.error(err)
    }
    // setClockBlack("--:--:--")

    try {
      setResult(bindResult(tour.Rounds[idround].Games[idgame].Resuft))
    } catch (err) {
      console.error(err)
    }

    setCurrentRound(idround)
    setCurrentGame(idgame)
  }

  const bindListFen = (data) => {
    let list = []
  
    try {
      for (let i = 0; i < data.length; i++) {
        list.push(data[i].Fen)
      }
    } catch {
  
    }
  
    return list
  }
  
  const bindListMove = (data) => {
    let list = []
    
    let time = 0;
    try {
      for (let i = 1; i < data.length; i++) {
        //list[i - 1] = ChessUtil.getmove(data[i - 1], data[i])
    
        let obj = {
          Name: "",
          Side: null,
          TimeMove: "0s",
          Clock: "--:--:--",
        }
    
        try {
          // obj.Name = data[i].Name !== undefined ? data[i].Name : ChessUtil.getmove(data[i - 1].Fen, data[i].Fen)
          obj.Name = ChessUtil.getmove(data[i - 1].Fen, data[i].Fen)
        } catch (err) {
          console.error(err)
        }
    
        try {
          obj.Side = data[i - 1].Side
        } catch (err) {
          console.error(err)
        }
    
        try {
          obj.TimeMove = data[i].TimeMove
          time = convertTimeMoveToSecond(obj.TimeMove)
          obj.Clock = getClockBySecond(time)
        } catch (err) {
          console.error(err)
        }
    
        list[i - 1] = JSON.stringify(obj)
      }
    } catch {
  
    }
    return list
  }
  
  const bindListGame = (data) => {
    let list = []
  
    try {
      for (let i = 0; i < data.length; i++) {
        let obj = []
        for (let j = 0; j < data[i].Games.length; j++) {
          if (data[i].Games[j] !== undefined) {
            obj.push({
              white: data[i].Games[j].WhitePlayer.Name,
              black: data[i].Games[j].BlackPlayer.Name,
              result: bindResult(data[i].Games[j].Resuft)
            })
          } else {
            console.error(`Rounds: ${i} - Games: ${j} does not exist.`)
          }
        }
        list.push(obj)
      }
    } catch {
  
    }
  
    return list
  }
  
  const bindUserInfo = (data) => {
    let userInfo = {
      fullName: "",
      avatar: "/Images/avatar/default-avatar.jpg",
      national: "/Images/flag/default-flag.jpg",
      rating: ""
    }
  
    try {
      if (data.Name !== undefined) {
        userInfo.fullName = data.Name
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
      
      if (data.FideId !== undefined) {
        userInfo.avatar = "/Images/avatar/" + data.FideId + ".jpg"
      }
    
      // switch (data.FideId) {
      //   case "12424714":
      //     userInfo.avatar = "/Images/avatar/banh-gia-huy.jpg"
      //     break
      //   case "12424722":
      //     userInfo.avatar = "/Images/avatar/dau-khuong-duy.jpg"
      //     break
      //   case "12424730":
      //     userInfo.avatar = "/Images/avatar/dinh-nho-kiet.jpg"
      //     break
      //   case "12403547":
      //     userInfo.avatar = "/Images/avatar/doan-thi-hong-nhung.jpg"
      //     break
      //   case "12407135":
      //     userInfo.avatar = "/Images/avatar/hoang-thi-hai-anh.jpg"
      //     break
      //   case "12409910":
      //     userInfo.avatar = "/Images/avatar/kieu-bich-thuy.jpg"
      //     break
      //   case "12414816":
      //     userInfo.avatar = "/Images/avatar/nguyen-thien-ngan.jpg"
      //     break
      //   case "12407925":
      //     userInfo.avatar = "/Images/avatar/tran-dang-minh-quang.jpg"
      //     break
      //   case "14101254":
      //     userInfo.avatar = "/Images/avatar/vasilyev-mikhail.jpg"
      //     break
      //   case "12414697":
      //     userInfo.avatar = "/Images/avatar/luong-hoang-tu-linh.jpg"
      //     break
      //   case "12411248":
      //     userInfo.avatar = "/Images/avatar/pham-cong-minh.jpg"
      //     break
      //   default:
      //     break
      // }
  
      if (data.Rating !== undefined) {
        userInfo.rating = data.Rating
      }
    } catch {
  
    }
  
    return userInfo
  }

  const bindClock = (data) => {
    let clock = "--:--:--";
    try {
      if (data.length > 8) {
        clock = data.substring(0, 8);
      }
    } catch {

    }
    return clock;
  }
  
  const bindResult = (data) => {
    let result = ["0", "0"]
  
    try {
      switch (data) {
        case 2:
          result = ["1", "0"]
          break
        case 3:
          result = ["0", "1"]
          break
        case 4:
          result = ["1/2", "1/2"]
          break
        default:
          break
      }
    } catch {
      
    }
  
    return result
  }

  const convertTimeMoveToSecond = (timeMove) => {
    try {
      let time = timeMove.split(":")
      if (time.length == 2) {
        let minute = parseFloat(time[0].replace(/[^\d.]/g, ""))
        let second = parseFloat(time[1].replace(/[^\d.]/g, ""))
        return minute * 60 + second
      }
  
      return parseFloat(timeMove.replace(/[^\d.]/g, ""))
    } catch {
      return 0
    }
  }

  const getClockBySecond = (second) => {
    let now = new Date();
    let date1 = now.getTime();
    let date2 = now;
    date2 = date2.setSeconds(date2.getSeconds() + second);

    let distance = date2 - date1;
    if (distance < 0) {
      return "--:--:--";
    }

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = (days * 24) + Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (hours < 10) {
      hours = "0" + hours
    }
    if (minutes < 10) {
      minutes = "0" + minutes
    }
    if (seconds < 10) {
      seconds = "0" + seconds
    }

    return hours + ":" + minutes + ":" + seconds;
  }

  const getQueryString = (queryString) => {
    let url = new URL(window.location.href);
    return url.searchParams.get(queryString);
  }

  return (
    <div id="mainboard">
      <Header
        round={currentRound}
        tourName={tour !== undefined && tour.Name !== undefined ? tour.Name : ""}
        tourDate={tour !== undefined && tour.Date !== undefined ? tour.Date : ""}
        listGame={listGame}
        listRound={tour !== undefined && tour.Rounds !== undefined ? tour.Rounds : []}
        changeselectgame={callSelectedGame}
      />

      <main id="content" className="content clearfix">
        <div className="content-left float-left">
          <div className="player">
            <div className="player-wrapper text-center">
              <img src={playerBlack.avatar} alt={playerBlack.fullName} className="avatar" />
              <p className="fullname">{playerBlack.fullName}</p>
              <div className="secondary">
                {/* <img src={playerBlack.national} alt="" className="national" align="center" /> */}
                <span className="score">{playerBlack.rating}</span>
              </div>
              <div className="time">
                <span>{clockBlack}</span>
              </div>
            </div>
            <div className="main-score text-center">{result[1]}</div>
          </div>
          <div className="player text-center">
            <div className="player-wrapper text-center">
              <div className="time">
                <span>{clockWhite}</span>
              </div>
              <img src={playerWhite.avatar} alt={playerWhite.fullName} className="avatar" />
              <p className="fullname">{playerWhite.fullName}</p>
              <div className="secondary">
                {/* <img src={playerWhite.national} alt="" className="national" align="center" /> */}
                <span className="score">{playerWhite.rating}</span>
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
                  <p className="score">{playerBlack.rating}</p>
                  {/* <img src={playerBlack.national} alt="" className="national" /> */}
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
                  <p className="score">{playerWhite.rating}</p>
                  {/* <img src={playerWhite.national} alt="" className="national" /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-right float-left">
          <ViewMoves goToMove={goToMove} listMove={listMove} currentMove={currentMove} />

          <p className="score text-center">{result[0]} - {result[1]}</p>
          <div className="list-function text-center clearfix">
            <div className="item float-left">
              <button type="button" id="btn-begin-move" onClick={() => beginMove()}><i className="fas fa-fast-backward"></i></button>
            </div>
            <div className="item float-left">
              <button type="button" id="btn-back-move" onClick={() => backMove()}><i className="fas fa-caret-left"></i></button>
            </div>
            <div className="item float-left">
              <span className="current-state">{currentMove === listMove.length ? "Live" : (listMove[currentMove - 1] !== undefined ? JSON.parse(listMove[currentMove - 1]).Name : "")}</span>
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
            <span className="current-state">{currentMove === listMove.length ? "Live" : (listMove[currentMove - 1] !== undefined ? JSON.parse(listMove[currentMove - 1]).Name : "")}</span>
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
  )
}

export default Board
