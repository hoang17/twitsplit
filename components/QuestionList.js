import QuestionRow from '../components/QuestionRow'

export default ({ questions, userIP, sortField, sortMap, onSort }) => {

  return (
    <div>
      {
        sortMap.map(e =>
          <button key={e.id} className={sortField==e.id?'active':''} onClick={() => onSort(e.id)}>{e.name}</button>
        )
      }
      <ul>
        {
          questions &&
          questions.map(e =>
            <QuestionRow key={e.id} userIP={userIP} {...e} />
          )
        }
      </ul>
      <style jsx>{`
        ul {
          padding:0;
          text-align: left;
        }
        button.active {
          color: white;
          background-color:green;
        }
      `}</style>
    </div>
  )
}
