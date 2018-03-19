import TextareaAutosize from 'react-autosize-textarea'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'

export default ({ question, onSubmit, onChange }) => {

  return (
    <div>
      <div>Ask the speaker</div>
      <p/>
      <TextareaAutosize
        onChange={e => onChange({text: e.target.value})}
        placeholder={'Type your question'}
        value={question.text}
        rows={5}
        maxRows={10}
        style={{width:'100%'}}
        />
      <p/>
      <TextField
        value={question.userName}
        onChange={e => onChange({userName: e.target.value})}
        margin="normal"
        placeholder="Your name (optional)"
      />
      <p/>
      <Button variant="raised" color="secondary" onClick={onSubmit}>Send Question</Button>
    </div>
  )
}
