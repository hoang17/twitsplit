import TextareaAutosize from 'react-autosize-textarea'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'

export default ( question, userName, onSubmit, onChange }) => {

  return (
    <div>
      <div>Ask the speaker</div>
      <p/>
      <TextareaAutosize
        onChange={e => onChange({question: e.target.value})}
        placeholder={'Type your question'}
        value={question}
        rows={5}
        maxRows={10}
        style={{width:'100%'}}
        />
      <p/>
      <TextField
        value={userName}
        onChange={e => onChange({userName: e.target.value})}
        margin="normal"
        placeholder="Your name (optional)"
      />
      <p/>
      <Button variant="raised" color="secondary" onClick={this.onSubmit}>Send Question</Button>
    </div>
  )
}
