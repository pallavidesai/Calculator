function dis(val) 
{ 
    document.getElementById("result").value+=val 
} 
  
//function that evaluates the digit and return result 
function solve() 
{ 
    let x = document.getElementById("result").value 
    let y = eval(x) 
    document.getElementById("input").value = x + "=" + y 
    document.getElementById("result").value = y 
    $("input").change()
} 
  
//function that clear the display 
function clr() 
{ 
    document.getElementById("result").value = "" 
} 