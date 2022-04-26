import React from "react";
import equal from 'fast-deep-equal'

class Listgame extends React.Component{
    state={
        btnSelected:1,
        selectgame:0,
        listGame:null,
    }

    callListgame=(idgame)=>{
        // console.log("selectgame:"+idgame)
        this.setState({selectgame:idgame});
        this.props.callbacklistgame(this.state.btnSelected,idgame);
    }

    listGameView=()=>{
        var dat=[];
        if(this.state.listGame){
            let number=1;
            for(let i=0;i<this.state.listGame[this.state.btnSelected-1].length;i++){
                dat.push(
                    <tr class="listgame"  className={this.state.selectgame===i ? 'listgameselected':'listgamenonselect'} >
                        <th width="12%">{number++}</th>
                        <th width="30%"><button onClick={()=>this.callListgame(i)}>{this.state.listGame[this.state.btnSelected-1][i].white} </button> </th>
                        <th width="30%"><button onClick={()=>this.callListgame(i)}>{this.state.listGame[this.state.btnSelected-1][i].black}  </button></th>
                        <th width="20%">-:-</th>
                        <th>0-0</th>
                    </tr>
                );
            }
        }       
        return(
            <div >
                <table width="100%" style={{backgroundColor:'blue'}}> 
                    <tr width="100%" style={{color:'white'}}>
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

    gotoRound=(round)=>{
        this.props.callbacklistgame(round,this.state.selectgame);
        this.setState({btnSelected:round});
        // console.log("number:"+round)
    }
    
    roundbutton =(lenround)=>{
        var dat=[];
        for(let i=1;i<=lenround;i++){
            dat.push(<button 
                onClick={()=>this.gotoRound(i)} 
                className={this.state.btnSelected===i ? 'btnselected':'btnnonselect'}
                >{i}</button>);
        }       
        return dat;
    }

    componentDidUpdate(prevProps){
        if(!equal(this.props.listgame,prevProps.listgame)){
            if(this.props.listgame.length>0){
                this.setState({listGame:this.props.listgame})
            }
        }
    }

    render(){
        return(
            <div className="collapse" id="listgameTaget" style={{position:'fixed',top:'8%', left:'10%',width:'80%',
                backgroundColor:'red',zIndex:4,}}>
                <div id="listgameround" >
                    Round {this.roundbutton(this.props.lenround)}                 
                </div>
                {this.listGameView()}
            <img src={"./Images/logochess.png"} />  
            </div> 
        );
    }
}

export default Listgame;