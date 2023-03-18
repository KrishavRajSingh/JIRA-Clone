// console.log("linked");
let adBtn=document.querySelector(".add-btn");
let removeBtn=document.querySelector(".remove-btn");
let modalCont=document.querySelector(".modal-cont")
let mainCont=document.querySelector(".main-cont");
let textArea=document.querySelector(".textarea-cont");
let AllpriorityColor=document.querySelectorAll(".priority-color");
let colors=["lightred","lightblue","lightgreen","lightyellow"];
let modalPriorityColor=colors[0];
let toolboxColors=document.querySelectorAll(".color");
let ticketArr=[];
// let lockClass = "fa-lock";
// let unlockClass = "fa-lock-open";
let addFlag;
let removeFlag;

if(localStorage.getItem("jiraTickets")){
    ticketArr=JSON.parse(localStorage.getItem("jiraTickets"));
    ticketArr.forEach((ticketObj)=>{
        createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketID,false);
    })
}

toolboxColors.forEach((Col)=>{
    Col.addEventListener("click",(e)=>{
        currToolBoxColor=Col.classList[0];
        let tkts=document.querySelectorAll(".ticket-cont");
        tkts.forEach((tkt)=>{
            let tktColor=tkt.children[0].classList[1];
            if(tktColor==currToolBoxColor)
            tkt.style.display="block";
            else
            tkt.style.display="none";
        })
    })
    Col.addEventListener("dblclick",(e)=>{
        displayAll();
    })
})

function displayAll(){
    let tkts=document.querySelectorAll(".ticket-cont");
    tkts.forEach((tkt)=>{
        tkt.style.display="block";
    })
}

// event listener for modal priority coloring 
AllpriorityColor.forEach((color)=>{
    color.addEventListener("click",(e)=>{
        
        AllpriorityColor.forEach((colorE)=>{
            colorE.classList.remove("border");
        })
        color.classList.add("border");
        modalPriorityColor=color.classList[0];
    })
})


adBtn.addEventListener("click",(e)=>{
    addFlag=!addFlag;
    removeFlag=false;
    if(addFlag){
        modalCont.style.display="flex";
        setBorderToDefault();
    }else{
        modalCont.style.display="none";
    }
    console.log("clicked");
});
removeBtn.addEventListener("click",(e)=>{
    removeFlag=!removeFlag;
    adBtn=false;
    let allElem=document.querySelectorAll(".ticket-cont");
    allElem.forEach((ticket)=>{
        ticket.addEventListener("click",(e)=>{
            
            let id=ticket.querySelector(".ticket-id").innerText.split("#")[1];
            console.log(id);
            handleRemover(ticket,id);
        })
    })

    
})

modalCont.addEventListener("keydown",(e)=>{
    let key=e.key;
    if(key==="Shift"){
        createTicket(modalPriorityColor,textArea.value,shortid(),true);
        modalCont.style.display="none";
        textArea.value="";
        addFlag=false;
        displayAll();
        // modalCont.innerText="";
    }
})
function createTicket(ticketColor,ticketTask,ticketID,flag){
    let ticketCont=document.createElement("div");
    ticketCont.setAttribute("class","ticket-cont");
    ticketCont.innerHTML=`
            <div class="ticket-color ${ticketColor}"></div>
            <div class="ticket-id">#${ticketID}</div>
            <div class="task-area">
                ${ticketTask}
            </div>
            <div class="ticket-lock">
                <i class="fa-solid fa-lock"></i>
            </div>
    `;
    mainCont.appendChild(ticketCont);
    if(flag){
        ticketArr.push({ticketColor,ticketID,ticketTask});
        localStorage.setItem("jiraTickets",JSON.stringify(ticketArr));
    }
    handleLock(ticketCont,ticketID);
    handleColor(ticketCont,ticketID);

    // allLocks=document.querySelectorAll(".fa-solid");
    // lockingSystem();
}

function handleColor(ticket,id){
    let ticketColor=ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click",(e)=>{
        // get ticketIdx form ticketArr
        let TIdx=getTicketIdx(id);

        let currColor=ticketColor.classList[1];
        // get idx of current color
        let currColIdx=colors.findIndex((color)=>{
            return currColor===color;
        })
        
        let nextColIdx=(currColIdx+1)%4;
        let newColor=colors[nextColIdx];
        ticketColor.classList.remove(currColor);
        ticketColor.classList.add(newColor);

        // modify data in local storage
        ticketArr[TIdx].ticketColor = newColor;
        // console.log(ticketArr[TIdx].ticketColor)
        localStorage.setItem("jiraTickets",JSON.stringify(ticketArr))
    })
    
}

function getTicketIdx(id){
    let ticketIdx=ticketArr.findIndex((ticketObj)=>{
        // console.log(id===ticketObj.ticketID,ticketObj.ticketID===id)
        return ticketObj.ticketID===id;
    })
    return ticketIdx;
}

function handleRemover(ticket,id){
    // removeFlag -> true -> remove
    if(removeFlag){
        // to get the index of ticket arr to be removed
        let TIdx=getTicketIdx(id);
        ticketArr.splice(TIdx,1);
        // updating the local storage with the updated ticketArr after removal
        localStorage.setItem("jiraTickets",JSON.stringify(ticketArr));
        ticket.remove();
        // removeFlag=false;
    }
}

function handleLock(ticket,id){
    let ticketLockElem=ticket.querySelector(".ticket-lock");
    let ticketLock=ticketLockElem.children[0];
    let ticketTaskArea= ticket.querySelector(".task-area");
    ticketLock.addEventListener("click",(e)=>{
        // get ticket index where the task is to be modified
        let TIdx=getTicketIdx(id);
        if(ticketLock.classList.contains("fa-lock")){
            ticketLock.classList.remove("fa-lock");
            ticketLock.classList.add("fa-lock-open");
            ticketTaskArea.setAttribute("contenteditable","true");
            // console.log(ticketLock.classList[1])
        }else{
            ticketLock.classList.remove("fa-lock-open");
            ticketLock.classList.add("fa-lock");
            ticketTaskArea.setAttribute("contenteditable","false");
            // modify data in lock storage(Task)
            ticketArr[TIdx].ticketTask=ticketTaskArea.innerText;
            localStorage.setItem("jiraTickets",JSON.stringify(ticketArr));
        }
    })

}

function setBorderToDefault(){
    AllpriorityColor.forEach((colorE)=>{
        colorE.classList.remove("border");
    })
    AllpriorityColor[0].classList.add("border");
}

