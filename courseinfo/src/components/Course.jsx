const Part = ({name, exercises}) => {
  return (
    <div>{name} {exercises}</div>
  )
}

const Content = ({course}) => {
  return (
    <div>
    {course.parts.map(part => 
      <Part name={part.name} exercises={part.exercises} key={part.id}/>
    )}
    <b>total of {course.parts.reduce((total, part) => total + part.exercises, 0)}</b>
    </div>
  )
}

const Header = ({text}) => <h2>{text}</h2>

const Course = ({course}) => {
  return (
  <div>
    <Header text={course.name}/>
    <Content course={course}/>
  </div>
  )
}

export default Course
