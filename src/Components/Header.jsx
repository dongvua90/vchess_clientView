import React, { useEffect } from "react";
import { Alert, Button, Offcanvas, Accordion, Pagination, ButtonGroup } from 'react-bootstrap';
import { Collapse } from 'bootstrap'
import equal from 'fast-deep-equal'

class Header extends React.Component {
  state = {
    toggle: false,
    round: 1,
    game: 0,
    round_max: 0,
    whitename: "",
    blackname: "",
  }

  handlerRoundChange = (event) => {
    let value = event.target.value
    this.setState({
      round: value,
      whitename: this.props.listgame[value][this.state.game].white,
      blackname: this.props.listgame[value][this.state.game].black,
    })
    this.props.changeselectgame(value, this.state.game);  // truyền thông số cho Parent
    event.target.blur()
  }

  handlerGameChange = (event) => {
    let value = event.target.value
    this.setState({
      game: value,
      whitename: this.props.listgame[this.state.round][value].white,
      blackname: this.props.listgame[this.state.round][value].black,
    });
    this.props.changeselectgame(this.state.round, value);  // truyền thông số cho Parent
    event.target.blur()
  }

  componentDidUpdate(prevProps) {
    if (!equal(this.props.listgame, prevProps.listgame)) {
      this.setState({
        whitename: this.props.listgame[0][0].white,
        blackname: this.props.listgame[0][0].black,
        round_max: this.props.listgame.length,
      });
    }
  }
  
  roundbutton = (round_max) => {
    var dat = [];
    for (let i = 0; i < round_max; i++) {
      if (i == this.state.round) {
        dat.push(<option value={i} selected="selected">Round {i + 1}</option>)
      } else {
        dat.push(<option value={i}>Round {i + 1}</option>)
      }
    }
    return dat;
  }

  listGameView = () => {
    var dat = [];
    if (this.state.round_max > 0) {
      for (let i = 0; i < this.props.listgame[this.state.round].length; i++) {
        dat.push(<option value={i}>{this.props.listgame[this.state.round][i].white} ({this.props.listgame[this.state.round][i].result[0]}) - ({this.props.listgame[this.state.round][i].result[1]}) {this.props.listgame[this.state.round][i].black}</option>);
      }
    }
    return dat
  }

  render() {
    return (
      <header id="header" class="content">
        <div class="header-left content-left">
          <div class="text-center">
            <p>Live system by</p>
            <img src="/Images/logo.svg?v=1.0.0" alt="Amitech" class="logo" />
          </div>
        </div>
        <div class="header-center content-center">
          <div class="wrapper">
            <h1 class="page-title text-center">Hanoi GM and IM Chess Tournament 2022</h1>
            <div class="list-select clearfix">
              <div class="item float-left">
                <select onChange={(event) => this.handlerRoundChange(event)}>
                  {this.roundbutton(this.state.round_max)}
                </select>
              </div>
              <div class="item float-left">
                <select onChange={(event) => this.handlerGameChange(event)}>
                  {this.listGameView()}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="header-right content-right">
          <p class="label-date">Date: 2022.05.25</p>
        </div>
      </header>
    );
  }
}
export default Header;