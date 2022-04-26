import React,{useState,useEffect} from 'react'
import {Alert,Button,Offcanvas,Accordion,Pagination,ButtonGroup} from 'react-bootstrap';
import {Collapse} from 'bootstrap'


function Round(){
    var [lenround,setLenround]=useState(2);
    var dat=[];
    var wid = parseInt(100/(lenround+1))+'%';
    for(let i=1;i<=lenround;i++){
        dat.push(<button ><b>{i}</b></button>);
    }       
    return dat;
}

function Headtitle(){
    var [tourname,setTourname]=useState('ĐẤU TRƯỜNG DANH VỌNG');
    var [playernameA,setPlayernameA]=useState('Dang van phuc');
    var [playernameB,setPlayernameB]=useState('Nguyen van A');
    var [roundnumber,setRoundnumber]=useState(1);
    var [boardnumber,setBoardnumber]=useState(3);
    var [toggle, setToggle] = useState(false);
    var dat=[];

    useEffect(() => {
        var myCollapse = document.getElementById('collapseTarget')
        var bsCollapse = new Collapse(myCollapse, {toggle: false})
        toggle ? bsCollapse.show() : bsCollapse.hide()
    })

let active = 2;
let items = [];
for (let number = 1; number <= 5; number++) {
  items.push(
    <Pagination.Item key={number} active={number === active}>
      {number}
    </Pagination.Item>,
  );
}

    dat.push(
    <div>
        <div onClick={()=>{setToggle(toggle => !toggle)}} style={{textAlign:'center',backgroundColor:'red',position:'relative',height:'80px',backgroundColor:'#4D6F94',color:'white',alignItems:'center' }}>
            <h4 style={{paddingTop:'10px'}}><b>{tourname}</b></h4>
            <h6>{playernameA} <small>vs</small> {playernameB}</h6>
            <img src={"./Images/logochess.png"} style={{position:'absolute',left:0,top:0,width:80,height:80}}></img>
            <div style={{position:'absolute',right:5,top:10 }}>
                <h6>Round {roundnumber}</h6>
                <h6>Board {boardnumber}</h6>
            </div>    
        </div> 
        <div className="collapse" id="collapseTarget" style={{color:'black', position:'relative',top:'0px', left:'10%',width:'80%',
        backgroundColor:'red',position:'absolute',zIndex:4,top:80}}>
        <div class="pagination">
            <h6>Round</h6>
            <Round/>
        </div>         
<table class="tabb">
  <tr >
    <th>Company</th>
    <th>Contact</th>
    <th>Country</th>
  </tr>
  <tr>
    <td>Alfreds Futterkiste</td>
    <td>Maria Anders</td>
    <td>Germany</td>
  </tr>
  <tr>
    <td>Centro comercial Moctezuma</td>
    <td>Francisco Chang</td>
    <td>Mexico</td>
  </tr>
  <tr>
    <td>Ernst Handel</td>
    <td>Roland Mendel</td>
    <td>Austria</td>
  </tr>
  <tr>
    <td>Island Trading</td>
    <td>Helen Bennett</td>
    <td>UK</td>
  </tr>
  <tr>
    <td>Laughing Bacchus Winecellars</td>
    <td>Yoshi Tannamuri</td>
    <td>Canada</td>
  </tr>

</table>
            <img src={"./Images/logochess.png"} />                      
        </div>
    </div>
    );
    return dat;
}

export default Headtitle;