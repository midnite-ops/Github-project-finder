import { useEffect, useState } from 'react'
import './App.scss'
import { use } from 'react'

function App() {
  const [allLanguages, setAllLanguages] = useState([])
  const [repositories, setRepositories] = useState([])
  const [error, setError] = useState(false)
  const [isEmpty, setIsEmpty] = useState(true)
  const [language, setLanguage] = useState()
  const [message, setMessage] = useState('Please select a language')
  const [selectedRepo, setSelectedRepo] = useState({})
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json')
    .then((res) => {
      if(!res.ok){
        throw new Error('Couldnt Load languages')
      }
      return res.json()
    })
    .then(data => setAllLanguages(data))
    .catch((error) => {
      console.log('fsafd')
    })
  }, [])

  useEffect(() => {
    if(repositories.length > 0){
      console.log(repositories)
      setIsEmpty(false)
      handleRender()
    }
  }, [repositories])

  function fetchLanguage(event){
    const value = event.target.textContent
    fetch(`https://api.github.com/search/repositories?q=language:${value}`)
    .then((res) => {
      if(!res.ok){
        throw new Error
      }
      return res.json()
    })
    .then(data => setRepositories(data.items))
    .catch((error) => {
      setMessage('Error fetching repositories')
      setError(true)
    })
    setLanguage(value)
    setMessage('Loading please wait....')
  }
  function handleRender(){
    const random =  Math.floor(Math.random() * repositories.length)
    const randomRepo = repositories[random]
    setSelectedRepo(
      {
        title: randomRepo.title,
        description: randomRepo.description,
        forks: randomRepo.forks,
        issues: randomRepo.issues,
        language: randomRepo.language
      }
    )
  }
  return (
    <section className="finder">
      <div className='top'>
        <div className='top-box'></div>
        <h5>Github Repository Finder</h5>
      </div>
      <div className="accordion center" id='accordionExample'>
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
              {language ? `Language: ${language}` : 'Select a Language'}
            </button>
          </h2>
          <div id="collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              {}
              <ul>
                {
                  allLanguages.map((item, index) => (
                    item.title === 'All Languages' ? null : <li key={index} onClick={fetchLanguage}>{item.title}</li>
                  ))
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom">
        {isEmpty && (
          <div className={`bottom-text ${isEmpty ? 'error-text' : ''}`}>
            <p>{message}</p>
            {isEmpty && (
              <button className='retry-btn'>Click to retry</button>
            )}
          </div>
        )}
        {!isEmpty && (
          <div className='bottom-repo'>
            <h3>{selectedRepo.title}</h3>
            <p>{selectedRepo.description}</p>
            <div className="bottom-repo-info">
              <div>
                <div></div>
                <p>{selectedRepo.language}</p>
                <p>{selectedRepo.stars}</p>
                <p>{selectedRepo.forks}</p>
                <p>{selectedRepo.issues}</p>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </section>
  )
}

export default App
