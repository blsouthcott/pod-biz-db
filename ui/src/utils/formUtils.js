export const validateAgeInput = (e, ageVar, setAgeVarFn) => {
    e.target.value == '' || e.target.value >= 1 ? setAgeVarFn(e.target.value) : setAgeVarFn(ageVar);
};


const preferNotToSay = 'Prefer not to say';
const nonBinary = 'Non-Binary';
const female = 'Female';
const male = 'Male';

// set gender select options
export const genderOptions = [
    {
        value: '',
        text: '',
    },
    {
        value: female,
        text: female
    },
    {
        value: male,
        text: male
    },
    {
        value: nonBinary,
        text: nonBinary
    },
    {
        value: preferNotToSay,
        text: preferNotToSay
    }
]


export let formatPhoneNum = (e) => {
    console.log('event: ', e);

    const phoneNum = e.target.value
    const newChar = phoneNum[phoneNum.length-1]

    if (e.nativeEvent.inputType === 'insertText') {
        if (isNaN(newChar)) {
            return phoneNum.slice(0, phoneNum.length-1);
        } else if (phoneNum.length === 3) {
            return `(${phoneNum}) `;
        } else if (phoneNum.length === 10) {
            return `${phoneNum.slice(0,9)}-${phoneNum.slice(9)}`;
        } else if (phoneNum.length > 14) {
            return `${phoneNum.slice(0,14)}`
        }
    } else {
        if (phoneNum.length === 3) {
            return (phoneNum.slice(1).trim());
        }
    }

    
    
    // switch (true) {
    //     case phoneNum.length === 3:
    //         return `(${phoneNum}) `;
    //     case phoneNum.length < 3 && phoneNum[0] === '(':
    //         return `${phoneNum.slice(1,3)}`;
    //     case phoneNum.length === 10 && phoneNum[9] !== '-':
    //         return `${phoneNum.slice(0,9)}-${phoneNum.slice(9)}`;
    //     case phoneNum.length > 14:
    //         return `${phoneNum.slice(0,14)}`
    //     default:
    //         return phoneNum;
    //     }
}


export const validatePhoneNum = (phoneNum) => {

}
