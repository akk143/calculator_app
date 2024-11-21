const getscreen = document.querySelector('.screen');

let curinput = '';
let previnput = '';
let operator = null;

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
        updatescreen('');

    }else if(btnval === '←'){
        
        curinput = curinput.toString().slice(0,-1);
        updatescreen(curinput || 0);

    }else if(['÷', '×', '−', '+', '%'].includes(btnval)){

        if(curinput){

            if(previnput && operator){
                curinput = calculate(previnput, curinput, operator).toString();
            }
            operator = btnval;
            previnput = curinput;
            curinput = '';

        }else if(previnput) {
            operator = btnval;
        }

        updatescreen();

    }else if(btnval === '.'){

        if(!curinput.includes('.')){
            curinput = curinput || '0';
            curinput += '.';
        }
        updatescreen(curinput);

    }else if(btnval === '='){

        if(previnput && curinput && operator){

            curinput = calculate(previnput, curinput, operator);
            previnput = '';
            operator = null;
            updatescreen(curinput);

        }

    }else{

        if(btnval === '0' && curinput === '0'){
            return;
        }

        if(curinput === '0' && btnval !== '.'){
            curinput = btnval;
        } else {
            curinput += btnval;
        }

        updatescreen(curinput);
    }

}


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