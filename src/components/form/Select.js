import styles from './Select.module.css';

function Select({text, name, options, handleOnChange, value}){

    return(
        <div className={styles.form_control}>
            <label htmlFor={name}>{text}:</label>
            <select name={name} id={name} onChange={handleOnChange} value={value || ''}>
                <option selected>Selecione uma opção</option>
                {
                    options.map((op) => (
                        <option value={op.id} key={op.id}>{op.name}</option>
                    ))
                }
            </select>
        </div>
    )
}

export default Select;