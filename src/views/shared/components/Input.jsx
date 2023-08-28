import PropTypes from "prop-types";
const Input = (props) => {
  let inputElement;
  let labelElement;

  switch (props.type) {
    case "textarea":
      inputElement = (
        <textarea
          className="form-textarea"
          name={props.inputName}
          rows="4"
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.changeHandler}
        />
      );
      break;
    case "checkbox":
      inputElement = (
        <input
          className="form-checkbox form-check-input"
          name={props.inputName}
          type="checkbox"
          checked={props.value}
          onChange={props.changeHandler}
        />
      );
      break;
    case "number":
      inputElement = (
        <input
          className="form-input"
          name={props.inputName}
          type="number"
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.changeHandler}
        />
      );
      break;
    case "email":
      inputElement = (
        <input
          className="form-input"
          name={props.inputName}
          type="email"
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.changeHandler}
        />
      );
      break;
    case "text":
      inputElement = (
        <input
          className="form-input"
          name={props.inputName}
          type={props.type}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.changeHandler}
        />
      );
      break;
    default:
      inputElement = (
        <input
          className="form-input"
          name={props.inputName}
          type="text"
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.changeHandler}
        />
      );
      break;
  }

  if (props.label) {
    labelElement = <label className="form-label">{props.label}: </label>;
  }

  return (
    <div className="form-group row">
      {labelElement} {/* Render label element within the JSX structure */}
      {inputElement}
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.string.isRequired,
  inputName: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  //value:PropTypes.object,
  label: PropTypes.string,
  changeHandler: PropTypes.func.isRequired,
};

Input.defaultProps = {
  type: () => "",
  name: () => "",
  placeholder: "",
  //value: false,
  label: "",
  changeHandler: () => "No change handler defined",
};

export default Input;
