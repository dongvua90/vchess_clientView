import React, { useEffect } from "react";
import { Alert, Button, Offcanvas, Accordion, Pagination, ButtonGroup } from 'react-bootstrap';
import { Collapse } from 'bootstrap'
import equal from 'fast-deep-equal'

class Header extends React.Component {
  state = {
    toggle: false,
    round: 0,
    game: 0,
    round_max: 0,
    whitename: "",
    blackname: "",
  }

  handlerRoundChange = (value) => {
    this.setState({
      round: value,
      whitename: this.props.listgame[value][this.state.game].white,
      blackname: this.props.listgame[value][this.state.game].black,
    })
    this.props.changeselectgame(value, this.state.game);  // truyền thông số cho Parent
  }
  handlerGameChange = (value) => {
    this.setState({
      game: value,
      whitename: this.props.listgame[this.state.round][value].white,
      blackname: this.props.listgame[this.state.round][value].black,
    });
    this.props.changeselectgame(this.state.round, value);  // truyền thông số cho Parent
  }

  componentDidUpdate(prevProps) {
    if (!equal(this.props.listgame, prevProps.listgame)) {
      this.setState({
        whitename: this.props.listgame[0][0].white,
        blackname: this.props.listgame[0][0].black,
        round_max: this.props.listgame.length,
      });
    }
    var myCollapse = document.getElementById('listgameTaget')
    var bsCollapse = new Collapse(myCollapse, { toggle: false })
    this.state.toggle ? bsCollapse.show() : bsCollapse.hide()
  }

  roundbutton = (round_max) => {
    var dat = [];
    for (let i = 0; i < round_max; i++) {
      dat.push(<button
        onClick={() => this.handlerRoundChange(i)}
        className={this.state.round === i ? 'roundselected' : 'roundnonselect'}
      >{i + 1}</button>);
    }
    return dat;
  }

  listGameView = () => {
    var dat = [];
    if (this.state.round_max > 0) {
      let number = 1;
      for (let i = 0; i < this.props.listgame[this.state.round].length; i++) {
        dat.push(
          <tr class="listgame" className={this.state.game === i ? 'listgameselected' : 'listgamenonselect'} >
            <th width="12%">{number++}</th>
            <th width="30%"><button onClick={() => this.handlerGameChange(i)}>{this.props.listgame[this.state.round][i].white} </button> </th>
            <th width="30%"><button onClick={() => this.handlerGameChange(i)}>{this.props.listgame[this.state.round][i].black}  </button></th>
            <th width="20%">-:-</th>
            <th>0-0</th>
          </tr>
        );
      }
    }
    return (
      <div >
        <table width="100%" style={{ backgroundColor: 'blue' }}>
          <tr width="100%" style={{ color: 'white' }}>
            <th width="12%">No.</th>
            <th width="30%">White</th>
            <th width="30%">Black</th>
            <th width="20%">Time</th>
            <th >Resuft</th>
          </tr>
        </table>
        <div >
          <table width="100%" >
            {dat}
          </table>
        </div>
      </div>
    );
  }

  viewgames = () => {
    return (
      <div className="collapse" id="listgameTaget" style={{ position: 'fixed', top: '8%', left: '10%', width: '80%', backgroundColor: 'red', zIndex: 4, }}>
        <div id="listgameround" >
          Round {this.roundbutton(this.state.round_max)}
        </div>
        {this.listGameView()}
      </div>
    );
  }

  listgameCallback = (idround, idgame) => {
    console.log("Round:" + idround + " idgame:" + idgame);
    this.setState({
      round: idround,
      game: idgame,
    })
    this.setState({ toggle: false });
    this.props.callSelectGame(idround, idgame);
  }

  render() {
    return (
      <div>
        <div id="header" onClick={() => { this.setState({ toggle: !this.state.toggle }); }}>
          <tr>
            <th><img src={"./Images/logochess.png"} style={{ padding: 5, }} ></img></th>
            <th class="headermain">
              <div id="headertitle">{this.props.tourname}</div>
              <div id="headersubtitle">{this.state.whitename}<small>&nbsp;&nbsp;vs&nbsp;&nbsp;</small>{this.state.blackname}</div>
            </th>
            <th id="headerright">
              <h6>Round {this.state.round + 1}</h6>
              <h6>Game {this.state.game + 1}</h6>
            </th>
          </tr>
        </div>
        <this.viewgames />
      </div>
    );
  }
}
export default Header;