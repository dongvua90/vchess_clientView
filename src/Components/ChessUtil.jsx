
function sqToFileRank(sq){
    let filerank={
        file:0,
        rank:0,
        tfile:"",
        trank:"",
    }
    filerank.file = sq%8;
    filerank.rank = parseInt((63-sq)/8);
    filerank.tfile = String.fromCharCode(filerank.file + 97);
    filerank.trank = String.fromCharCode(filerank.rank + 49);
    return filerank;
}
function sqToText(sq){
    return String.fromCharCode(sq%8 + 97) + String.fromCharCode(parseInt((63-sq)/8) + 49);
}

exports.getmove = function(oldFen,CurrentFen){
    // console.log("Old:"+oldFen);
    // console.log("Cur:"+CurrentFen);
    let change=[];
    let numberChange=0;
    let file,rank;
    let sqFrom,sqTo;
    let piecemove;
    let iskill;
    for(let i =0;i<64;i++){
        if(oldFen.charAt(i)!=CurrentFen.charAt(i)){
            change[numberChange]=i;
            numberChange++;          
        }
    }

    if(numberChange==2){   // di chuyển & ăn quân bình thường & phong hậu
        if(CurrentFen.charAt(change[0])=='-'){ 
            sqFrom = change[0];
            sqTo = change[1];
        }else{
            sqFrom = change[1];
            sqTo = change[0];
        }
        if(oldFen.charAt(sqTo)!='-'){   // xác định có phải ăn quân hay không
            iskill='x';
        }else{
            iskill='';
        }
        let ch = oldFen.charAt(sqFrom);
        ch = ch.toUpperCase();
        switch(ch){
            case "K": piecemove = piecemove='\u2654'; break;
            case "Q": piecemove = piecemove='\u2655'; break;
            case "R": piecemove = piecemove='\u2656'; break;
            case "B": piecemove = piecemove='\u2657'; break;
            case "N": piecemove = piecemove='\u2658'; break;
            case "P": piecemove = '';break;
        }
        return piecemove + iskill + sqToText(sqTo);
        // console.log("Move:"+piecemove + iskill + sqToText(sqTo));
    }else if(numberChange==3){   // ăn tốt qua đường
        sqTo = -1;
        sqFrom=-1;
        let ch;
        for(let i=0;i<3;i++){
            if(oldFen.charAt(change[i])=='-'){
                sqTo = change[i];
                ch=CurrentFen.charAt(sqTo);
            }
        }
        for(let i=0;i<3;i++){
            if(oldFen.charAt(change[i])==ch){
                sqFrom=change[i];
            }
        }
        if(sqTo==-1 || sqFrom==-1){
            return "???";
            // console.log("Move error");
        }else{
            return sqToText(sqFrom)+'x'+sqToText(sqTo);
            // console.log("Move:"+sqToText(sqFrom)+'x'+sqToText(sqTo));
        }
    }else if(numberChange==4){ // nhập thành
        sqTo = -1;
        sqFrom=-1;
        for(let i=0;i<3;i++){
            if(CurrentFen.charAt(change[i])=='k' || CurrentFen.charAt(change[i])=='K'){  // ô sqTo là king 
                sqTo = change[i];
            }else if(oldFen.charAt(change[i])=='k' || oldFen.charAt(change[i])=='K'){
                sqFrom = change[i];
            }
        }
        if(oldFen.charAt(sqFrom)=='k' & CurrentFen.charAt(sqTo)=='k' & sqFrom ==4 ){
            if(sqTo==6){
                return "O-O";
                // console.log("Move:O-O")
            }else if(sqTo==2){
                return "O-O-O";
                // console.log("Move:O-O-O");
            }
        }else if(oldFen.charAt(sqFrom)=='K' & CurrentFen.charAt(sqTo)=='K' & sqFrom ==60 ){
            if(sqTo==62){
                return "O-O";
                // console.log("Move:O-O")
            }else if(sqTo==58){
                return "O-O-O";
                // console.log("Move:O-O-O");
            }
        }else{
            return "???";
            // console.log("move error");
        }
    }else{
        return "???";
        // console.log("move error");
    }
}
