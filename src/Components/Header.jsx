import React, { useEffect } from "react"
import { Alert, Button, Offcanvas, Accordion, Pagination, ButtonGroup } from 'react-bootstrap'
import { Collapse } from 'bootstrap'
import equal from 'fast-deep-equal'
import moment from 'moment'

class Header extends React.Component {
  state = {
    toggle: false,
    round: 0,
    game: 0,
    roundCount: 0,
    whiteName: "",
    blackName: "",
  }

  handlerRoundChange = (event) => {
    let value = event.target.value
    this.setState({
      round: value,
      whiteName: this.props.listGame[value][this.state.game].white,
      blackName: this.props.listGame[value][this.state.game].black,
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
        whiteName: this.props.listGame[0][0].white,
        blackName: this.props.listGame[0][0].black,
        roundCount: this.props.listGame.length,
      })
    }
  }
  
  listRound = () => {
    let dat = []
    for (let i = 0; i < this.state.roundCount; i++) {
      dat.push(<option key={i} value={i}>Round {i + 1}</option>)
    }
    return dat
  }

  listGameView = () => {
    let dat = []
    if (this.state.roundCount > 0) {
      for (let i = 0; i < this.props.listGame[this.state.round].length; i++) {
        dat.push(<option key={i} value={i}>{this.props.listGame[this.state.round][i].white} ({this.props.listGame[this.state.round][i].result[0]}) - ({this.props.listGame[this.state.round][i].result[1]}) {this.props.listGame[this.state.round][i].black}</option>)
      }
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
          <p className="label-date">Date: {this.props.tourDate !== "" ? moment(this.props.tourDate).format('YYYY.MM.DD') : ""}</p>
        </div>
      </header>
    )
  }
}
export default Header