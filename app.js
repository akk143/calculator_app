const getscreen = document.querySelector('.screen');
const clearallbtn = document.querySelector('.clearall');

let curinput = '';
let previnput = '';
let operator = null;
let resultdisplay = false;

const updatescreen = function(value){

    if(value === 'Error'){

        getscreen.textContent = value + '!';
        getscreen.style.color = 'red';

    }else if(previnput && operator){

        getscreen.textContent = `${previnput} ${operator} ${curinput || ''}`;
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

    }else if(btnval === '.'){

        if(!curinput.includes('.')){
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