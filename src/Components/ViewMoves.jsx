import React from "react"

class ViewMoves extends React.Component {
  goToMove = (number, isWhite) => {
    this.props.goToMove(number, isWhite)
  }

  render() {
    let dat = []
    let numberMove = 1

    let listMove = []
    for (let i = 0; i < this.props.listMove.length; i++) {
      listMove.push(JSON.parse(this.props.listMove[i]))
    }

    for (let i = 0; i < listMove.length; i++) {
      let cssClassWhite = ""
      let cssClassBlack = ""
      if (this.props.currentMove - 1 === i) {
        cssClassWhite += " active"
      }
      if (this.props.currentMove - 1 === i + 1) {
        cssClassBlack += " active"
      }

      if (listMove[i + 1] !== undefined) {
        dat.push(
          <tr key={i}>
            <td className="text-center">{numberMove++}.</td>
            <td className="text-center"><p className={cssClassWhite} onClick={() => this.goToMove(i, 0)}><span className="name">{listMove[i].Name}</span> <span className="time-move">{listMove[i++].TimeMove}</span></p></td>
            <td className="text-center"><p className={cssClassBlack} onClick={() => this.goToMove(i, 1)}><span className="name">{listMove[i].Name}</span> <span className="time-move">{listMove[i].TimeMove}</span></p></td>
          </tr>
        )
      } else {
        dat.push(
          <tr key={i}>
            <td className="text-center">{numberMove++}.</td>
            <td className="text-center"><p className={cssClassWhite} onClick={() => this.goToMove(i, 0)}><span className="name">{listMove[i].Name}</span> <span className="time-move">{listMove[i++].TimeMove}</span></p></td>
            <td className="text-center"><p className={cssClassBlack}>---</p></td>
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