import "./Input.scss";


function Input({
 label,
 type,
 customClass,
 name,
 handleChange,
 defaultValue,
 disabled,
 maxLength,
}) {
 return (
   <section className="input">
     <label className="input__label" htmlFor={name}>{label}</label>
<input
  id={name} // adiciona o id ao input
  type={type}
  className={`input__field ${customClass ? customClass : ""}`}
  name={name}
  onChange={handleChange}
  defaultValue={defaultValue ? defaultValue : ""}
  maxLength={maxLength}
  disabled={disabled}
/>
   </section>
 );
}


export default Input;
