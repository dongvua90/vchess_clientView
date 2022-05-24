import React from "react";

class ViewMoves extends React.Component {
  gotoMove = (number, iswhite) => {
    this.props.myonclick(number, iswhite);
  }

  componentDidMount() {
    console.log(this.props.moves);
  };

  render() {
    var dat = [];
    let numberMove = 1;
    for (let i = 0; i < this.props.moves.length; i++) {
      let cssClassWhite = "";
      let cssClassBlack = "";
      if (this.props.currentMove - 1 === i) {
        cssClassWhite += " active";
      }
      if (this.props.currentMove - 1 === i + 1) {
        cssClassBlack += " active";
      }

      if (this.props.moves[i + 1] !== undefined) {
        dat.push(
          <tr>
            <td class="text-center">{numberMove++}.</td>
            <td class="text-center"><span class={cssClassWhite} onClick={() => this.gotoMove(i, 0)}>{this.props.moves[i++]}</span></td>
            <td class="text-center"><span class={cssClassBlack} onClick={() => this.gotoMove(i, 1)}>{this.props.moves[i]}</span></td>
          </tr>
        );
      } else {
        dat.push(
          <tr>
            <td class="text-center">{numberMove++}.</td>
            <td class="text-center"><span class={cssClassWhite} onClick={() => this.gotoMove(i, 0)}>{this.props.moves[i++]}</span></td>
            <td class="text-center"><span class={cssClassBlack}>---</span></td>
          </tr>
        );
      }
    }

    return (
      <div>
        <div class="header text-center clearfix">
          <div class="item float-left">No.</div>
          <div class="item float-left">White</div>
          <div class="item float-left">Black</div>
        </div>
        <div class="table-data scroll">
          <table>
            {dat}
          </table>
        </div>
      </div>
    );
  };
}

export default ViewMoves;