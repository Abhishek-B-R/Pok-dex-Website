import "./ToggleSwitch.css";

const ToggleSwitch = ({ label, onToggle ,isChecked,setIsChecked}) => {

    const handleChange = (event) => {
        const checked = event.target.checked;
        setIsChecked(checked);

        // Notify parent component of the current state
        if (onToggle) {
            onToggle(checked);
        }
    };

    return (
        <div className="container">
            {label}{" "}
            <div className="toggle-switch">
                <input
                    type="checkbox"
                    className="checkbox"
                    name={label}
                    id={label}
                    checked={isChecked}
                    onChange={handleChange} // Update state on toggle
                />
                <label className="label" htmlFor={label}>
                    <span className="inner" />
                    <span className="switch" />
                </label>
            </div>
        </div>
    );
};

export default ToggleSwitch;
