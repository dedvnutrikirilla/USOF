module.exports = class InputClass{
    constructor([value, setValue], [errorValue, setErrorValue], 
    [isError, setIsError], label, name, type) {
        this.label = label;
        this.name = name;
        this.type = type;

        this.value = value;
        this.setValue = setValue;

        this.errorValue = errorValue;
        this.setErrorValue = setErrorValue;
        this.isError = isError;
        this.setIsError = setIsError;
    };

    onChange = (data) => {
        this.setValue(data.target.value);
        if(this.isError) {
            this.setIsError(false);
            this.setErrorValue('');
        }
    };

    showError = (errText, toClear = false) => {
        console.log('settin error');
        this.setIsError(true);
        this.setErrorValue(errText);
        if(toClear) this.setValue('');
    }
}