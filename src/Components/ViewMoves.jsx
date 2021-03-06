import React from "react";

class ViewMoves extends React.Component{

    gotoMove=(number,iswhite)=>{
        this.props.myonclick(number,iswhite);
    }


    componentDidMount(){
        console.log(this.props.moves);
    };

    render(){
        var dat=[];
        let numberMove=1;
        for(let i=0;i<this.props.moves.length-1;i++){
            dat.push(
                <tr class="movestr">
                    <td>{numberMove++}.</td>
                    <td ><button class="pgnmove" onClick={()=>this.gotoMove(i,0)} >{this.props.moves[i++]}</button></td>
                    <td ><button class="pgnmove" onClick={()=>this.gotoMove(i,1)}>{this.props.moves[i]}</button></td>
                </tr>
            );
        }

        return(
            <div id="pgnlistmoves">
                <table > 
                    <tr id="pgnlistmoveheader">
                        <th width="12%">No.</th>
                        <th width="40%">White</th>
                        <th width="40%">Black</th>
                        <th> </th>
                    </tr>
                </table>
                <div id="pgnlistmovebody">
                <table > 
                    {dat}
                </table>
                </div>
            </div>
        );
    };
}

export default ViewMoves;