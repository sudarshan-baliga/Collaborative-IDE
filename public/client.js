var socket = io();
var front = []; 
var end = [];
var gotcodesflag = 0;
var element = document.getElementById("textarea");
var languageselect = document.getElementById("languages");
var cm = CodeMirror(element,{
    mode:"python",
    lineNumbers: true,
    styleActiveLine: true,
    autoCloseBrackets: true,
   
});
cm.on('change',function(i,change){
    if(front[0] != change.from && end[0] != change.to && gotcodesflag == 1) // gotcodeflag to make sure that it is  not initial data which we recieve
     {
         socket.emit("change",change); 
    } 
    else{
        front.shift();
        end.shift();
     }   
});


socket.on("change",function(data){  
    front.push(data.change.from);  
    end.push(data.change.to);
    //console.log(data);
    cm.replaceRange(data.change.text,data.change.from,data.change.to);
});

socket.on("codes",function(data){
    if(data.num == 0)   //if empty
        gotcodesflag = 1;
    else
    for(i = 0 ; data.codes[i] != undefined;i++){
     cm.replaceRange(data.codes[i].text,data.codes[i].from,data.codes[i].to);
     if(--data.num == 0)    //if all initial value added
        gotcodesflag = 1;
    };
    
});

socket.on("selectlanguage",function(data){
    languageselect.value = data;
});


language = function(){
    cm.setOption('mode',languageselect.value); 
}

languageselect.addEventListener("change",function(){
    socket.emit("selectlanguage",languageselect.value);
})

//initialize select language
var elem = document.querySelector('select');
  var instance = M.FormSelect.init(elem);

//dark theme
dark =$('#dark');
darkFlag = 0;
dark.change(function(){
    if($(this).is(":checked"))
        cm.setOption('theme',"material");
    else{
        cm.setOption('theme',"default");
    }
})
 