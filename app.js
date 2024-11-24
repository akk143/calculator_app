const getscreen = document.querySelector('.screen');
const clearallbtn = document.querySelector('.clearall');
const getcalbuttons = document.querySelectorAll('.cal-button');
// console.log(getcalbuttons);  // Node List


let curinput = '';
let previnput = '';
let operator = null;
let resultdisplay = false;

const updatescreen = function(value){

    if(value === 'Error'){

        getscreen.textContent = value + '!';
        getscreen.style.color = 'red';

    }else if(previnput && operator){

        getscreen.textContent = `${previnput} ${operator} ${curinput.startsWith('-') ? `(${curinput})` : curinput || ''}`;
        getscreen.style.color = 'black';

    }else{

        getscreen.textContent = value || 0;
        getscreen.style.color = 'black';
        
    }
}

// updatescreen(42); 
// console.log(getscreen.textContent); 


const handlebtn = (e) => {

    const btnval = e.target.textContent;
    // console.log(btnval);

    if(btnval === 'C'){

        curinput = '';
        previnput = '';
        operator = null;

        resultdisplay = false;

        updatescreen('');
        toggleClearAll();

    }else if(btnval === '←'){
        
        if(curinput){

            // If there is input in the current value, delete the last digit of the current number
            curinput = curinput.toString().slice(0, -1);
            updatescreen(curinput || 0);

        }else if(operator && previnput){

            // If the operator exists, remove the operator and display the previous input
            operator = null;
            updatescreen(previnput);

        }else if(previnput){

            // If there’s no curinput and no operator, start removing digits from the previnput
            previnput = previnput.toString().slice(0, -1);
            updatescreen(previnput || 0);

        }

        toggleClearAll();

    }else if(['÷', '×', '−', '+', '%'].includes(btnval)){

        if(curinput){

            // If there is curinput, calculate and store the result
            if(previnput && operator){
                curinput = calculate(previnput, curinput, operator).toString();
            }

            operator = btnval;
            previnput = curinput;
            resultdisplay = false;
            curinput = '';

        }else if(previnput){
            operator = btnval;            // If there is a previnput, just set the operator
        }

        updatescreen();

    }else if(btnval === '+/-'){

        if(curinput){

            // toggle the curinput
            curinput = curinput.toString().startsWith('-') ? curinput.toString().slice(1) : '-' + curinput;

        }else if(previnput && !curinput && !resultdisplay){

            // if no curinput, toggle the previnput
            previnput = previnput.toString().startsWith('-') ? previnput.toString().slice(1) : '-' + previnput;

        }else if(resultdisplay){

            // if resultdisplay, toggle the result
            curinput = getscreen.textContent.toString().startsWith('-') ? getscreen.toString().textContent.slice(1) : '-' + getscreen.textContent;
            resultdisplay = false;

        }

        updatescreen(curinput || previnput);

    }else if(btnval === '.'){

        if(resultdisplay){

            curinput += ".";
            resultdisplay = false;

        }else if(!curinput.includes('.')){

            curinput = curinput || '0';
            curinput += '.';

        }

        updatescreen(curinput);
        toggleClearAll();

    }else if(btnval === '='){

        if(previnput && curinput && operator){

            curinput = calculate(previnput, curinput, operator);
            previnput = '';
            operator = null;

            resultdisplay = true;

            updatescreen(curinput);
        }

        toggleClearAll();

    }else{

        if(btnval === '0' && curinput === '0'){
            return;                       // Don't allow multiple zeros
        }
        if(curinput === '0' && btnval !== '.'){
            curinput = btnval;            // Replace zero if a non-zero number is pressed
            
        }else{
            curinput += btnval;           // Add digit to the current input
        }

        resultdisplay = false;
        updatescreen(curinput);
        toggleClearAll();

    }

};



// Toggle the clearall button to show "←" or "C"
const toggleClearAll = () => {

    if(resultdisplay || (!curinput && !previnput)){
        clearallbtn.textContent = 'C';    // If there's no input or result, show "C"

    }else{
        clearallbtn.textContent = '←';    // Otherwise, show "←"
    }

};



const calculate = (num1, num2, operator) => {

    // console.log('hay');

    const a = parseFloat(num1);
    const b = parseFloat(num2);

    if(isNaN(a) || isNaN(b)) return '';

    switch(operator){
        case '÷':
            return b === 0 ? 'Error' : (a / b);
        case '×':
            return (a * b);
        case '−':
            return (a - b);
        case '+':
            return (a + b);
        case '%':
            return b === 0 ? 'Error' : (a % b);
        default:
            return '';
    }

}



document.querySelectorAll('.cal-button').forEach((btn) => {
    btn.addEventListener('click',handlebtn);
}); 



document.addEventListener('keydown', function(e){

    let key = e.key;
    console.log(key);


    if('0123456789'.includes(key)){

        const nums = Array.from(getcalbuttons).find(num => num.textContent === key);
        // console.log(nums);
        if(nums) nums.click();
        
    }


    if('+-×÷'.includes(key)){

        let operatorMap = {
            '+': '+',
            '-': '−',
            '*': '×',  
            '/': '÷' 
        };

        const operatorSymbol = operatorMap[key] || key;
        const operatorBtn = Array.from(getcalbuttons).find(btn => btn.textContent === operatorSymbol);
        if(operatorBtn) operatorBtn.click();

    }


    // Ensure Shift key handling for *
    if(key === '*' && e.shiftKey){
        const operatorBtn = Array.from(getcalbuttons).find(btn => btn.textContent === '×');
        if(operatorBtn) operatorBtn.click();
    }


    // Handle enter or "=" key
    if(key === 'Enter' || key === '='){
        const equalButton = Array.from(getcalbuttons).find(btn => btn.textContent === '=');
        if(equalButton) equalButton.click();
    }


    // Handle backspace key
    if(key === 'Backspace'){
        const backspaceButton = Array.from(getcalbuttons).find(btn => btn.textContent === '←');
        if(backspaceButton) backspaceButton.click();
    }


    // Handle clear Escape
    if(key === 'Escape'){
        const clearButton = Array.from(getcalbuttons).find(btn => btn.textContent === 'C');
        if(clearButton) clearButton.click();
    }


    // Handle dot key (.)
    if(key === '.'){
        const dotButton = Array.from(getcalbuttons).find(btn => btn.textContent === '.');
        if(dotButton) dotButton.click();
    }

    // Handle dot key (/)
    if(key === '/' && !e.shiftKey){
        const operatorBtn = Array.from(getcalbuttons).find(btn => btn.textContent === '÷');
        if(operatorBtn) operatorBtn.click();
    }
    
});



document.querySelector('.fa-calculator').addEventListener('click', function() {
    const dropdown = this.nextElementSibling;
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});


// let n = 5;
// let string = "";
// for (let i = 1; i <= n; i++){
//   for (let j = 0; j < i; j++){
//     string += "*";
//   }
//   string += "\n";
// }
// console.log(string);

