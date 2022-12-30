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
