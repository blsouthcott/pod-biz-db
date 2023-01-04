

export const updateSelectedVals = (e, setStateVarFn) => {
    let vals = []
    for (let i=0; i<e.target.options.length; i++) {
        if (e.target.options[i].selected) {
            vals.push(e.target.options[i].value);
        }
    };
    setStateVarFn(vals);
};
