import { useEffect, useState } from 'react'
import forks from './assets/forks.svg';
import stars from './assets/star.svg'
import issues from './assets/issues.svg'
import './App.scss'
import { use } from 'react'

function App() {
  const [allLanguages, setAllLanguages] = useState([])
  const [allLanguagesError, setAllLanguagesError] = useState(false)
  const [allLanguagesMessage, setAllLanguagesMessage] = useState('Loading languages...')
  const [repositories, setRepositories] = useState([])
  const [error, setError] = useState(false)
  const [isEmpty, setIsEmpty] = useState(true)
  const [language, setLanguage] = useState('Select a language')
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
      setAllLanguagesError(true)
      setAllLanguagesMessage('Error fetching languages, please check your connection and try again')
    })
  }, [])

  useEffect(() => {
    if(repositories.length > 0){
      console.log(repositories)
      setIsEmpty(false)
      handleRender()
    }
  }, [repositories])

  function fetchLanguage(value){
    console.log(value)
    setError(false);
    setIsEmpty(true);
    setMessage('Loading please wait....');

    fetch(`https://api.github.com/search/repositories?q=language:${value}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch repositories");
        }
        return res.json();
      })
      .then(data => setRepositories(data.items))
      .catch(error => {
        console.error(error);
        setMessage('Error fetching repositories');
        setError(true);
      });
    
  } function handleRender(){
    const random =  Math.floor(Math.random() * repositories.length)
    const randomRepo = repositories[random]
    console.log(randomRepo.forks)
    setSelectedRepo(
      {
        title: randomRepo.name, description: randomRepo.description === null ? 'No description available' : randomRepo.description,
        forks: randomRepo.forks_count,
        issues: randomRepo.open_issues_count,
        stars: randomRepo.stargazers_count,
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
              {language}
            </button>
          </h2>
          <div id="collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              {allLanguagesError && (<p>{allLanguagesMessage}</p>)}
              {!allLanguagesError && (
                <ul>
                  {
                    allLanguages.map((item, index) => (
                      item.title === 'All Languages' ? null : <li key={index} onClick={() => {
                        fetchLanguage(item.title)
                        setLanguage(item.title)
                      }} href='#collapseOne' data-bs-toggle="collapse">{item.title}</li>
                    ))
                  }
                </ul>
              )}
             
            </div>
          </div>
        </div>
      </div>
      <div className="bottom">
        {isEmpty && (
          <>
            <div className={`bottom-text ${error ? 'error-text' : ''}`}>
              <p>{message}</p>
            </div>
            {error && (
              <button className='retry-btn' onClick={() => {fetchLanguage(language)}}>Click to retry</button>
            )}
          </>
          
        )}
        {!isEmpty && (
          <>
            <div className='bottom-repo'>
              <h5>{selectedRepo.title}</h5>
              <p>{selectedRepo.description}</p>
              <div className="bottom-repo-info">
                <div>
                  <div></div>
                  <p>{selectedRepo.language}</p>
                </div>
                <div>
                  <img src={stars} alt="an icon of stars" />
                  <p>{selectedRepo.stars}</p>
                </div>
                <div>
                  <img src={forks} alt="an icon of a fork" />
                  <p>{selectedRepo.forks}</p>
                </div>
                <div>
                  <img src={issues} alt="an icon of issues" />
                  <p>{selectedRepo.issues}</p>
                </div>
              </div>
            </div>
            <button className='refresh-btn' onClick={handleRender}>Refresh</button>
          </>
          
        )}
        
      </div>
    </section>
  )
}

export default App
