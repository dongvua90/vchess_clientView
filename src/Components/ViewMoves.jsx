import React from "react"

class ViewMoves extends React.Component {
  goToMove = (number, iswhite) => {
    this.props.goToMove(number, iswhite)
  }

  render() {
    let dat = []
    let numberMove = 1
    for (let i = 0; i < this.props.moves.length; i++) {
      let cssClassWhite = ""
      let cssClassBlack = ""
      if (this.props.currentMove - 1 === i) {
        cssClassWhite += " active"
      }
      if (this.props.currentMove - 1 === i + 1) {
        cssClassBlack += " active"
      }

      if (this.props.moves[i + 1] !== undefined) {
        dat.push(
          <tr key={i}>
            <td className="text-center">{numberMove++}.</td>
            <td className="text-center"><span className={cssClassWhite} onClick={() => this.goToMove(i, 0)}>{this.props.moves[i++]}</span></td>
            <td className="text-center"><span className={cssClassBlack} onClick={() => this.goToMove(i, 1)}>{this.props.moves[i]}</span></td>
          </tr>
        )
      } else {
        dat.push(
          <tr key={i}>
            <td className="text-center">{numberMove++}.</td>
            <td className="text-center"><span className={cssClassWhite} onClick={() => this.goToMove(i, 0)}>{this.props.moves[i++]}</span></td>
            <td className="text-center"><span className={cssClassBlack}>---</span></td>
          </tr>
        )
      }
    }

    return (
      <div>
        <div className="header text-center clearfix">
          <div className="item float-left">No.</div>
          <div className="item float-left">White</div>
          <div className="item float-left">Black</div>
        </div>
        <div className="table-data scroll">
          <table>
            <tbody>
              {dat}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default ViewMoves