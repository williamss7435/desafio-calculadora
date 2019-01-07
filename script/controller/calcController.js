class calcController{

    constructor(){
        this._audio = new Audio("click.mp3");
        this._operation = [""];
        this._displayCalc = document.querySelector("#display");
        this._displayDateTime = document.querySelector("#dateTime");
        this.AllButtonsCalc();
        this.allKeysCalc();
        this.displayDateTime();

    }

    displayDateTime(){
        let dateNow = this.currentDate();
        this._displayDateTime.innerHTML = `${dateNow.toLocaleDateString("pt-br")} - ${dateNow.toLocaleTimeString("pt-br")}`;
        
        setInterval(()=>{
            dateNow = this.currentDate();
            this._displayDateTime.innerHTML = `${dateNow.toLocaleDateString("pt-br")} - ${dateNow.toLocaleTimeString("pt-br")}`;
        },1000)
    }

    AllButtonsCalc(){
        let buttons = document.querySelectorAll(".container > .row > .btn");

        buttons.forEach(btn=>{

            btn.addEventListener("click",e=>{
                this.playAudio();
                this.addValBtn(btn.innerHTML);
            });

        })
    }

    allKeysCalc(){
        document.addEventListener("keyup", e=>{
            this.playAudio();
            switch(e.key){
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                case "+":
                case "-":
                case "*":
                case "/":
                    this.addElementOperation(e.key);
                    break;
                case ".":
                case ",":
                    this.addDot();
                case "Enter":
                    this.calcEqual();
                    break;
                case "Backspace":
                    this.CleanLastDigit();
                    break;
                case "Escape":
                    this.cleanAll();
                    break;
            }
        });

    }

    addValBtn(value){
        switch(value){
            case "=":
                this.calcEqual();
                break;
            case "%":
                this.calcPercentage();
                break;
            case "√":
                this.calcSqrt();
                break;
            case "x²":
                this.calcPow2();
                break;
            case "¹/x":
                this.calcFraction();
                break;
            case "C":
                this.cleanAll();
                break;
            case "CE":
                this.cleanLastNumber();
                break;
            case "←":
                this.CleanLastDigit();
                break;
            case ",":
                this.addDot();
                break;
            case "±":
                this.transformPositiveNegative();
                break;
            default:
                this.addElementOperation(value);
                break;
        }
    }


    addElementOperation(element){
        if(isNaN(element)){
           if(this._operation[0] == "") return;
           if(isNaN(this.getLastItem())){
               this.setLastItem(element);
           }else{
               this._operation.push(element);
           }
        }else if(this.getLastItem().length <= 12){
            if(isNaN(this.getLastItem())){
                this._operation.push(element);
            }else{
                this.setLastItem(this._operation[this._operation.length-1] + element.toString());
            }
            this.displayCalc = this._operation[this._operation.length-1];
        }

        this.calcOperation();
    }

    calcOperation(){
        if(this._operation.length>3){
            let lastItem = this._operation.pop();
            let result = eval(this._operation.join(""));
            this._operation = [result.toString(), lastItem];
            this.displayCalc = result;
        }
    }

    calcEqual(){
        let result;
        if(this._operation.length == 2){
            result = eval(`${this._operation[0]}${this._operation[1]}${this._operation[0]}`);
            this._operation = [result.toString(), this._operation[1]];
            this.displayCalc = this._operation[0];

        }else if(this._operation.length == 3){
            result = eval(`${this._operation[0]}${this._operation[1]}${this._operation[2]}`);
            this._operation = [result.toString()];
            this.displayCalc = result;
        }
    }

    calcPercentage(){
        let result;

        if(this._operation.length == 1){
            this._operation = [""];
            result = "0";
        }else if(this._operation.length == 2){
            result = ((this._operation[0]/100)*this._operation[0]);
            this._operation = [result, this._operation[1]];
        }else{
            result = ((this._operation[0]/100)*this._operation[2]);
            this._operation[2] = result;
        }

        if(this._operation.length == 3) this._operation.pop();

        this.displayCalc = result;
    }

    calcSqrt(){
        let result;
        
        if(this._operation.length == 1){
            result = Math.sqrt(this._operation[0]);
            this._operation[0] = result;
        }else if(this._operation.length == 2){
            result = Math.sqrt(this._operation[0]);
            this._operation.push(result);
        }else{
            result = Math.sqrt(this._operation[2]);
            this._operation[2] = result;
        }

        this.displayCalc = result.toFixed(10);
    }

    calcPow2(){
        let result;

        if(this._operation.length == 1){
            result = Math.pow(this._operation[0],2);
            this._operation[0] = result;
        }else if(this._operation.length == 2){
            result = Math.pow(this._operation[0],2);
            this._operation.push(result);
        }else{
            result = Math.pow(this._operation[2],2);
            this._operation[2] = result;
        }

        this.displayCalc = result;
    }

    calcFraction(){
        let result;

        if(this._operation.length == 1){
            result = this.transformFraction(this._operation[0]);
            this._operation[0] = result;
        }else if(this._operation.length == 2){
            result = this.transformFraction(this._operation[0]);
            this._operation.push(result);
        }else{
            result = this.transformFraction(this._operation[2]);
            this._operation[2] = result;
        }
        this.displayCalc = result;
    }

    transformFraction(value){
        let result;
        if (value.substring(1,2)  == "/"){
            result = value.slice(2).toString(); 
        }else{
            result = `1/${this._operation[0]}`;
        }
        return result;
    }

    getLastItem(){
        return this._operation[this._operation.length-1];
    }

    addDot(){
        let result = this._operation[this._operation.length-1];
        if(!isNaN(result) && result.indexOf(".") <= -1 && result != ""){
            result += ".";
            this._operation[this._operation.length-1] = result;
            this.displayCalc = result;
        }else if(result == ""){
            this._operation[this._operation.length-1] = "0.";
            this.displayCalc = this._operation[this._operation.length-1];
        }else if(isNaN(result)){
            result = "0.";
            this._operation.push(result);
            this.displayCalc = this._operation[this._operation.length-1];
        }
    }


    transformPositiveNegative(){
        let result = this._operation[this._operation.length-1];
        if(isNaN(result) || result == "0" || result == "") return;

        if(result.indexOf("-") <= -1){
            result = "-" + result.toString();
        }else{
            result = result.replace("-", "");
        }

        this._operation[this._operation.length-1] = result;
        this.displayCalc = result;
    }


    cleanLastNumber(){
        if(!isNaN(this.getLastItem())){
            this._operation.pop();
        }
        this.displayCalc = 0;
    }

    CleanLastDigit(){
        if(this._operation.length <= 0) return;

        let result;
        let lengthNumber = this._operation[this._operation.length-1].length;

        if(!isNaN(this.getLastItem())){

            if(lengthNumber>1){
                result = this._operation[this._operation.length-1].substring(0,lengthNumber-1);
            }else if(lengthNumber <= 1){
                result = "";
            }

            this._operation[this._operation.length-1] = result;
            this.displayCalc = (result == "") ? "0" : result;
        }

    }

    cleanAll(){
        this._operation = [""];
        this.displayCalc = 0;
    }

    setLastItem(item){
        this._operation[this._operation.length-1] = item;
    }

    currentDate(){
        return new Date();
    }

    get displayCalc(){
        return this._displayCalc.innerHTML;
    }

    set displayCalc(value){
        this._displayCalc.innerHTML = value;
    }

    playAudio(){
        this._audio.currentTime = 0;
        this._audio.play();
    }
}

