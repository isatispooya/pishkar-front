import { AiOutlineVerticalAlignTop } from "react-icons/ai";

export const minMaxFilterEditor = (cell, onRendered, success, cancel, editorParams)=>{
    var end;
    var container = document.createElement("span");
    var start = document.createElement("input");
    start.setAttribute("type", "number");
    start.setAttribute("placeholder", 'کف');
    start.setAttribute("min", 0);
    start.setAttribute("max", 100);
    start.style.padding = "4px";
    start.style.width = "50%";
    start.style.boxSizing = "border-box";
    start.value = cell.getValue();
    function buildValues(){success({start:start.value,end:end.value,});}
    function keypress(e){
        if(e.keyCode == 13){buildValues();}
        if(e.keyCode == 27){cancel();}    
    }
    end = start.cloneNode();
    end.setAttribute("placeholder", "سقف");
    start.addEventListener("change", buildValues);
    start.addEventListener("blur", buildValues);
    start.addEventListener("keydown", keypress);
    end.addEventListener("change", buildValues);
    end.addEventListener("blur", buildValues);
    end.addEventListener("keydown", keypress);
    container.appendChild(start);
    container.appendChild(end);
    return container;
 }

export const minMaxFilterFunction=(headerValue, rowValue, rowData, filterParams)=>{
        if(rowValue){
            if(headerValue.start != ""){
                if(headerValue.end != ""){
                    return rowValue >= headerValue.start && rowValue <= headerValue.end;
                }else{
                    return rowValue >= headerValue.start;
                }
            }else{
                if(headerValue.end != ""){
                    return rowValue <= headerValue.end;
                }
            }
        }
    return true; 
}
