

//名前空間
const myRoulette = {};

//定数
myRoulette.const = Object.freeze({
    key:{
        textArea:"inputTextArea",
    },
});

myRoulette.val = {
    nowNum:0,
    inputAreaArray:[],
    lotteryInterval:0,
};

//画面ロード時の処理
window.addEventListener("DOMContentLoaded", (event) => {
    
    //初期値の読み込み
    const localText = localStorage.getItem(myRoulette.const.key.textArea);
    document.getElementById("inputText").value = localText;
    let txt = document.getElementById("test");
    
    myRoulette.create();
})

//テキストエリアでキーを押したときにテキストを保存する
myRoulette.keyup = function(){
    const inputTextValue = document.getElementById('inputText').value
    localStorage.setItem(myRoulette.const.key.textArea, inputTextValue);   
};

//フォーカスが外れた時にルーレットの作成処理
myRoulette.onChange = function(){
    myRoulette.create();
};

//ストップ押下時の処理
myRoulette.pushStop = function (){   
    $('div.roulette').roulette('stop');
};

//スタート押下時の処理
myRoulette.pushStart = function (){
    $('div.roulette').roulette('start');
};

//ソートボタン押下時の処理
myRoulette.pushSort = function (){
    myRoulette.val.inputAreaArray.sort((a, b) => {
        return a.localeCompare(b, 'ja');
    });

    let setTextareaVal="";
    myRoulette.val.inputAreaArray.forEach(
        function(text){
            if(setTextareaVal == "")
            { setTextareaVal = text}
            else
            { setTextareaVal = setTextareaVal + "\r\n"  +text;}
        }
    );
    document.getElementById('inputText').value = setTextareaVal;
    const inputTextValue = document.getElementById('inputText').value
    localStorage.setItem(myRoulette.const.key.textArea, inputTextValue);   
    myRoulette.create();
};

//シャッフルボタン押下時の処理
myRoulette.pushShuffle = function (){
    const array =myRoulette.val.inputAreaArray;
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // 0 から i のランダムなインデックス
        [array[i], array[j]] = [array[j], array[i]]; // 要素を入れ替えます
      }
    
      myRoulette.val.inputAreaArray = array;
      
    let setTextareaVal="";
    myRoulette.val.inputAreaArray.forEach(
        function(text){
            if(setTextareaVal == "")
            { setTextareaVal = text}
            else
            { setTextareaVal = setTextareaVal + "\r\n"  +text;}
        }
    );
    document.getElementById('inputText').value = setTextareaVal;
    const inputTextValue = document.getElementById('inputText').value
    localStorage.setItem(myRoulette.const.key.textArea, inputTextValue);   
    myRoulette.create();
};


//シャッフルボタン押下時の処理
myRoulette.pushRemove = function (){
    const array =myRoulette.val.inputAreaArray;
    
    const removeArray = Array.from(new Set(array));

    myRoulette.val.inputAreaArray = removeArray;
      
    let setTextareaVal="";
    myRoulette.val.inputAreaArray.forEach(
        function(text){
            if(setTextareaVal == "")
            { setTextareaVal = text}
            else
            { setTextareaVal = setTextareaVal + "\r\n"  +text;}
        }
    );
    document.getElementById('inputText').value = setTextareaVal;
    const inputTextValue = document.getElementById('inputText').value
    localStorage.setItem(myRoulette.const.key.textArea, inputTextValue);   
    myRoulette.create();
};

//ルーレットの生成
myRoulette.create = async function(){
    const targetDiv = document.getElementsByClassName('roulette')[0];
    const clone = targetDiv.cloneNode( false );
    targetDiv.parentNode.replaceChild( clone , targetDiv );

    const inputTextValue = document.getElementById('inputText').value;
    myRoulette.val.inputAreaArray = inputTextValue.split(/\r\n|\n/);

    myRoulette.val.inputAreaArray.forEach(
        function(text){
            myRoulette.drawText(text);
        }
    );

    var option = {
		speed : 3000,
		duration : 60,
        startCallback : function() {
            console.log('start');
            document.getElementById('startButton').disabled = true;
            document.getElementById('stopButton').disabled = false;
            document.getElementById('sortButton').disabled = true;
            document.getElementById('shuffleButton').disabled = true;
            document.getElementById('removeButton').disabled = true;
        },
        slowDownCallback : function() {
            console.log('slowDown');
            document.getElementById('startButton').disabled = true;
            document.getElementById('stopButton').disabled = true;
            document.getElementById('sortButton').disabled = true;
            document.getElementById('shuffleButton').disabled = true;
            document.getElementById('removeButton').disabled = true;
        },
        stopCallback : function($stopElm) {
            console.log('stop');
            document.getElementById('startButton').disabled = false;
            document.getElementById('stopButton').disabled = true;
            document.getElementById('sortButton').disabled = false;
            document.getElementById('shuffleButton').disabled = false;
            document.getElementById('removeButton').disabled = false;
            document.getElementById('result').textContent  = $stopElm[0].art;
            console.log($stopElm[0].art);
        }
	}

    $('div.roulette').roulette(option);	
}

//MITで公開されてたroulette.jsが画像にしか対応してなかったから苦し紛れ
myRoulette.drawText = async function(text){
    const targetDiv = document.getElementsByClassName('roulette')[0];
    const canvas = document.createElement("canvas");
    canvas.height = 256;
    canvas.width = 1024;
    const ctx = canvas.getContext('2d');
    ctx.textAlign= 'center';
    ctx.font = "32px serif";
    ctx.fillText(text, canvas.width*0.5, canvas.height *0.5);

    const img = document.createElement("img");
    img.height = 256;
    img.width = 1024;
    img.art = text;
    img.src = canvas.toDataURL();
    targetDiv.appendChild(img);
}