
// var fenboard = "rnbqkbnrpppppppp--------------------------------PPPPPPPPRNBQKBNR"; // chứa thông số bàn cờ
// fenboard.split("");
// // cần hàm để lấy piece ở ô xác định:
// const getPieceAt=(file,rank)=>{   // file,rank: 0->7
//     let sq = (7-rank)*8+file;
//     return fenboard[sq];
// }


const Pgngame={
    event:"",
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
    extract:function(pgndata){
        var info = pgndata.split("\"]");    // tách chuỗi pgn ra các thành phần nhỏ hơn
        this.event=info[0].replace("[Event \"",''); // xóa bỏ các thành phần râu ria
        this.site=info[1].replace("[Site \"",'');
        this.date=info[2].replace("[Date \"",'');
        this.round=info[3].replace("[Round \"",'');
        this.white=info[4].replace("[White \"",'');
        this.black=info[5].replace("[Black \"",'');
        this.resuft=info[6].replace("[Result \"",'');
        this.ECO=info[7].replace("[ECO \"",'');
        this.whiteElo=info[8].replace("[WhiteElo \"",'');
        this.blackElo=info[9].replace("[BlackElo \"",'');
        this.timeControl=info[10].replace("[TimeControl \"",'');
        this.endTime=info[11].replace("[EndTime \"",'');
        this.termination=info[12].replace("[Termination \"",'');
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
          this.whiteMoves[i]=moves[i].split(" ")[0]; 
          this.blackMoves[i]=moves[i].split(" ")[1]; 
        }
    }
}

export default Pgngame;