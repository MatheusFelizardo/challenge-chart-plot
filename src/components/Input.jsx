
const Input = ({textareavalue, settextareavalue}) => {
    
    return (
        <div className="textarea-wrapper">
            <textarea 
            data-cy="textarea"
            spellCheck="false"
            className="textarea-field"
            value={textareavalue} 
            onChange={({target})=> settextareavalue(target.value)} 
            rows="12">
            </textarea>
        </div>
    )
}

export default Input
