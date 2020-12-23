import Head from 'next/head'
import { useState } from 'react'

export default function Home({ reminders }) {

  const [date, setDate] = useState(new Date())
  const [email, setEmail] = useState("")
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const onFormSubmit = async e => {
    e.preventDefault();
    console.log({date, email})

    if (isLoading) {
      return
    }
    setError(null)
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8080/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birthdayDate: date, email }),
      })
      const reminder = await response.json()
      console.log(reminder)
      reminders.push(reminder)
      setLoading(false)
    } catch (e) {
      setLoading(false)
      console.error(e)
      setError(`Il y a eu une erreur lors de la sauvegarde du rappel: ${e}`)
    }

  }

  return (
    <div>
      <h1>Anniversary Reminders set in database</h1>
      <ul>
        {reminders.map(reminder => <li>{reminder.id} > {reminder.birthdayDate} for {reminder.email}</li>)}
      </ul>

      <form onSubmit={(e) => onFormSubmit(e)}>
        <div>
          <label htmlFor="date">Date</label>
          <input name="date" type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input name="email" type="text" value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        <div className='block flex align-middle justify-center'>
        <button type="submit" className='bg-red-700 rounded text-white p-1.5 flex'>
          {isLoading && <>
          <svg className="animate-spin h-5 w-5 mr-3">
           
          </svg>
          Préparation du rappel...
          </>}
          {!isLoading && <span>Créer le rappel</span>}
        </button>
      </div>


      {
        error && <div className='bg-red-700 rounded-xl shadow-2xl text-white p-2'>
          {error}
        </div>
      }
      </form>
    </div>
  )
}

export async function getServerSideProps(context) {
  const res = await fetch(`http://localhost:8080/reminders`)
  const reminders = await res.json()

  if (!reminders) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      reminders
    }
  }
}
