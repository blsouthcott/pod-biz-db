

export const updateSelectedVals = (e, setStateVarFn) => {
    console.log(e.target.options);
    let vals = []
    for (let i=0; i<e.target.options.length; i++) {
        if (e.target.options[i].selected) {
            vals.push(e.target.options[i].value);
        }
    };
    setStateVarFn(vals);
};