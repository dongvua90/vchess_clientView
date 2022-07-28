import React, { useEffect } from "react"
import equal from 'fast-deep-equal'
import moment from 'moment'

class Header extends React.Component {
  state = {
    round: 0,
    game: 0,
    listRound: [],
    whiteName: "",
    blackName: "",
    roundDate: ""
  }

  handlerRoundChange = (event) => {
    let value = event.target.value
    let whiteName = ""
    try {
      whiteName = this.props.listGame[value][this.state.game].white
    } catch {

    }
    let blackName = ""
    try {
      blackName = this.props.listGame[value][this.state.game].black
    } catch {

    }
    let roundDate = ""
    try {
      roundDate = this.props.listRound[value].Date
    } catch {

    }
    this.setState({
      round: value,
      game: 0,
      whiteName: whiteName,
      blackName: blackName,
      roundDate: roundDate
    })
    this.props.changeselectgame(value, this.state.game)  // truyền thông số cho Parent
    event.target.blur()
  }

  handlerGameChange = (event) => {
    let value = event.target.value
    this.setState({
      game: value,
      whiteName: this.props.listGame[this.state.round][value].white,
      blackName: this.props.listGame[this.state.round][value].black,
    })
    this.props.changeselectgame(this.state.round, value)  // truyền thông số cho Parent
    event.target.blur()
  }

  componentDidUpdate(prevProps) {
    if (!equal(this.props.listGame, prevProps.listGame)) {
      this.setState({
        round: this.props.round,
        game: 0,
        whiteName: this.props.listGame[0][0].white,
        blackName: this.props.listGame[0][0].black,
        roundDate: this.props.listRound[0].Date
      })
    }
  }
  
  listRound = () => {
    let dat = []
    for (let i = 0; i < this.props.listRound.length; i++) {
      dat.push(<option key={i} value={i}>Round {i + 1}</option>)
    }
    return dat
  }

  listGameView = () => {
    let dat = []
    try {
      if (this.props.listRound.length > 0) {
        for (let i = 0; i < this.props.listGame[this.state.round].length; i++) {
          dat.push(<option key={i} value={i}>{this.props.listGame[this.state.round][i].white} ({this.props.listGame[this.state.round][i].result[0]}) - ({this.props.listGame[this.state.round][i].result[1]}) {this.props.listGame[this.state.round][i].black}</option>)
        }
      }
    } catch {

    }
    return dat
  }

  render() {
    return (
      <header id="header" className="content">
        <div className="header-left content-left">
          <div className="text-center">
            <p>Live system by</p>
            <img src="/Images/logo.svg?v=1.0.0" alt="Amitech" className="logo" />
          </div>
        </div>
        <div className="header-center content-center">
          <div className="wrapper">
            <h1 className="page-title text-center">{this.props.tourName}</h1>
            <div className="list-select clearfix">
              <div className="item float-left">
                <select onChange={(event) => this.handlerRoundChange(event)} value={this.state.round}>
                  {this.listRound()}
                </select>
              </div>
              <div className="item float-left">
                <select onChange={(event) => this.handlerGameChange(event)} value={this.state.game}>
                  {this.listGameView()}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="header-right content-right">
          <p className="label-date">{this.state.roundDate !== "" ? "Date: " + moment(this.state.roundDate).format('YYYY.MM.DD') : ""}</p>
        </div>
      </header>
    )
  }
}
export default Header