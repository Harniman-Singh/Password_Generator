const passwordDisplay=document.querySelector('[data-passwordDisplay]');
const copyBtn=document.querySelector('[data-copy]');
const copyMsg=document.querySelector('[data-copyMsg]');
const uppercaseCheck=document.querySelector('#uppercase');
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector('#numbers');
const symbolsCheck=document.querySelector('#symbols');
const generateBtn=document.querySelector('.generateButton');
const allCheckBox=document.querySelectorAll('input[type=checkbox]');


const inputSlider=document.querySelector('[data-lengthSlider]');   // for slider length
const lengthDisplay=document.querySelector('[data-lengthNumber]');  //for the number i.e 0 to 20


let password="";
let passwordLength=10; // at start 
let checkCount=1;
// set strength circle color to gery

// this will handle slider set passwordLength
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;

    // slider ka dark  hissa

    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min)) + "% 100%";
}
handleSlider();

const indicator=document.querySelector('[data-indicator]');

function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
    indis.classList.add('active');
    setTimeout(()=>{
        indis.classList.remove('active');

    },2000)
    
}

function getRndInteger(min,max){
   return  Math.floor(Math.random() * (max-min)) + min;   //as range is form 0 to max-min therefore addition of min is done for 0 to max
   // floor is for not getting decimal value
   // +min is for making range form min to max
}

function generateRandomNumber(){
    return  getRndInteger(0,9);
}
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));//ascii value of a to z

    // String  is used for making the no to alphabet 
}
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,90));//ascii value of a to z
}

const symbols='~!@#$%^&*(){]}[><,.?';
function generateSymbol(){
    const randNum=getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}


// strength weak or strong
let indis=document.querySelector('[indi-q]');
function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;


    if(hasUpper &&hasLower&&(hasNum || hasSym)&&passwordLength>=8){
        indis.innerHTML="Strong!!";
        setIndicator('#0f0');
        } else if( ((hasLower&&hasUpper) || (hasNum&&hasSym)) && passwordLength >= 6){
            indis.innerHTML="Medium!!";
            setIndicator("#ff0");
        }else{
            setIndicator('#f00');
            indis.innerHTML="Weak!!";
        }
}


async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";

    } catch(e){
        copyMsg.innerText="failed";
    }
    // to make copy wala span visible
    copyMsg.classList.add("active");
    
    setTimeout(()=>{
        copyMsg.classList.remove("active");
        copyMsg.innerText="";
    },2000);
}



// event listner on slider
inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

//copy
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

function handleCheckedBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    })

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}
// checkbox
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckedBoxChange);
})


// generate password
generateBtn.addEventListener('click',()=>{
    // none of the checkbox is selected
    if(checkCount<=0) return; 

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    // let's start the journey to find new password

    console.log("starting the journey");
    // remove old password
    password='';

    //let's put the stuff mentioned by checkboxes
    // if(uppercaseCheck.checked){
    //     password+=generateUpperCase();
    // }
    
    // if(lowercaseCheck.checked){
    //     password+=generateLowerCase();
    // }

    // if(numbersCheck.checked){
    //     password+=generateRandomNumber();
    // }

    // if(symbolsCheck.checked){
    //     password+=generateSymbol();
    // }

    let funcArr=[];
    //  int this we are adding the functions linke generate uppercase genratelowercase
    // funcArr=[generateUpperCase,generateLowerCase,generateRandomNumber,generateSymbol]
    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase); console.log(funcArr);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase); console.log(funcArr);

     if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);console.log(funcArr);
    }

    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);console.log(funcArr);
    }

    // compulsory addition

    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
        // funcArr[i]()  ----------   generateUpperCase(),lower,symbol,nmber
    }
    
    console.log("compulsory addition done");
    console.log(password);

    // remaining addition
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex=getRndInteger(0,funcArr.length);

     
        // console.log(randIndex);
        // console.log(funcArr[randIndex]());
    
        password+=funcArr[randIndex]();
        console.log(password);
    }
    console.log("remaining addition done");

    // now shuffle the password
    password=shufflePassword(Array.from(password));
    // show the password

    passwordDisplay.value=password;
    console.log("ui addition done");
    // calculate strength
    calcStrength();
});

function shufflePassword(array){
    // fisher yates method
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;

    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}