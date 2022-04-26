import React from "react";

class Pgnview extends React.Component{
    state={
        site:"",
        date:"",
        round:"",
        white:"",
        black:"",
        resuft:"",
        ECO:"",
        whiteElo:0,
        blackElo:0,
        timeControl:0,
        endTime:0,
        termination:"",
        whiteMoves:[],
        blackMoves:[],
    }
    extract=()=>{
        if(this.props.pgndata.length<1) return;
        var info = this.props.pgndata.split("\"]");    // tách chuỗi pgn ra các thành phần nhỏ hơn
        this.state.event=info[0].replace("[Event \"",''); // xóa bỏ các thành phần râu ria
        this.state.site=info[1].replace("[Site \"",'');
        this.state.date=info[2].replace("[Date \"",'');
        this.state.round=info[3].replace("[Round \"",'');
        this.state.white=info[4].replace("[White \"",'');
        this.state.black=info[5].replace("[Black \"",'');
        this.state.resuft=info[6].replace("[Result \"",'');
        this.state.ECO=info[7].replace("[ECO \"",'');
        this.state.whiteElo=info[8].replace("[WhiteElo \"",'');
        this.state.blackElo=info[9].replace("[BlackElo \"",'');
        this.state.timeControl=info[10].replace("[TimeControl \"",'');
        this.state.endTime=info[11].replace("[EndTime \"",'');
        this.state.termination=info[12].replace("[Termination \"",'');
        // var resuft = info[13].substring(info[13].length-3,info[13].length);
        // mảng cuối là danh sách nước đi
        // xóa bỏ các ký tự râu ria trước chuỗi trước khi phân tách các nước đi
        var moves =info[13].substring(0,info[13].length-3);
        for(let i=0;i<5;i++){
          let c = moves.charCodeAt(i);
          if(c<33){
            moves = moves.substring(1,moves.length);
          }
        }
        moves=moves.substring(2,moves.length); // xóa '1.'
        moves = moves.split('.');   // tách chuỗi thành mảng moves
        // xóa số đánh dấu nước đi
        for(let i=0;i<moves.length;i++){
          for(let j=0;j<3;j++){
            let c=moves[i].charCodeAt(moves[i].length-1);
            if(c >47 & c<58){  // neu la so thi remove no
              moves[i] = moves[i].substring(0,moves[i].length-1);
            }else if(c==32){  // nếu là 'space thì break luôn
                moves[i] = moves[i].substring(0,moves[i].length-1); 
                break;
            }
          } 
          if(moves[i].charCodeAt(0)==32){
              moves[i]=moves[i].substring(1,moves[i].length);
          }
          this.state.whiteMoves[i]=moves[i].split(" ")[0]; 
          this.state.blackMoves[i]=moves[i].split(" ")[1]; 
          let ch = this.state.whiteMoves[i].charAt(0);
          switch(ch){
              case "K": this.state.whiteMoves[i] = this.state.whiteMoves[i].replace("K",'\u2654'); break;
              case "Q": this.state.whiteMoves[i] = this.state.whiteMoves[i].replace("Q",'\u2655'); break;
              case "R": this.state.whiteMoves[i] = this.state.whiteMoves[i].replace("R",'\u2656'); break;
              case "B": this.state.whiteMoves[i] = this.state.whiteMoves[i].replace("B",'\u2657'); break;
              case "N": this.state.whiteMoves[i] = this.state.whiteMoves[i].replace("N",'\u2658'); break;
          }
          ch = this.state.blackMoves[i].charAt(0);
          switch(ch){
              case "K": this.state.blackMoves[i] = this.state.blackMoves[i].replace("K",'\u265A'); break;
              case "Q": this.state.blackMoves[i] = this.state.blackMoves[i].replace("Q",'\u265B'); break;
              case "R": this.state.blackMoves[i] = this.state.blackMoves[i].replace("R",'\u265C'); break;
              case "B": this.state.blackMoves[i] = this.state.blackMoves[i].replace("B",'\u265D'); break;
              case "N": this.state.blackMoves[i] = this.state.blackMoves[i].replace("N",'\u265E'); break;
          }
          
        }
    }

    gotoMove=(number,iswhite)=>{
        // console.log("number:"+number+" color:"+iswhite);
        // this.props.myonclick(number,iswhite);
    }

    render(){
        console.log(this.props.fens);
        var dat=[];
        this.extract();
        for(let i=0;i<this.state.whiteMoves.length;i++){
            dat.push(
                <tr class="movestr">
                    <td>{i+1}.</td>
                    <td ><button class="pgnmove" onClick={()=>this.gotoMove(i,1)} >ss</button></td>
                    <td ><button class="pgnmove" onClick={()=>this.gotoMove(i,0)}>dd</button></td>
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

export default Pgnview;