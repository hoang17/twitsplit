import QuestionRow from '../components/QuestionRow'

export default ({ questions, sortField, sortMap, onSort, admin = false }) => {

  return (
    <div>
      {
        sortMap &&
        sortMap.map(e =>
          <button key={e.id} className={sortField==e.id?'active':''} onClick={() => onSort(e.id)}>{e.name}</button>
        )
      }
      <ul>
        {
          questions &&
          questions.byId.map(id => {
            var e = questions.byHash[id]
            return <QuestionRow key={id} admin={admin} {...e} />
          })
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
