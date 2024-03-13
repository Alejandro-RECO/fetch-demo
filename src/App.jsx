import { useEffect, useState, } from 'react'
import './App.css'
import axiosInstance from './api';
import Summary from './component/Sumary';
import Carousel from './component/Carousel';
function App() {
  const [pokeList, setPokeList] = useState([])
  const [selectedPoke, setSelectedPoke] = useState({})
  const [page, setPage] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false)
  useEffect(()=>{
    const fetchData = async ()=> {
      const data = await axiosInstance.get('/pokemon?limit=4&offset=0');
      setPokeList(data.data.results)
    }
    fetchData()
  },[])

  const getInfo = async (url)=> {
    const data = await axiosInstance.get(url)
    setSelectedPoke({img: data.data.sprites.front_default, stats:data.data.stats})
  }
  const getPokemonList = ()=> {
    return pokeList.map((pokemon)=>{
      return {
        name: pokemon.name,
        img: '/whos.jpg',
        onClick: ()=> getInfo(pokemon.url)
      }
    })
  }
  const onNextPage = async()=> {
    setPage(page + 1);
    const data = await axiosInstance.get(`/pokemon?limit=4&offset=${page}`);
    setPokeList(data.data.results)
  }
  const onPrevPage = async()=> {
    setPage(page - 1);
    const data = await axiosInstance.get(`/pokemon?limit=4&offset=${page}`);
    setPokeList(data.data.results)
  
  }
  return (
    <div className={`flex flex-col w-full h-screen items-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-8`}>
      <button className='ml-auto' onClick={()=> setIsDarkMode(!isDarkMode)}>
        {<img width="35px" height="35px" src={ isDarkMode ? '/sun.svg' : '/moon.svg'}></img>}
      </button>
      <h1 className={`mb-5 text-3xl font-bold uppercase ${isDarkMode? 'text-white': 'text-black' }`}> PokeDex</h1>
      <Carousel onLeftClick={onPrevPage} onRightClick={onNextPage} elementList={getPokemonList()}/>
      <div>
        {Object.keys(selectedPoke).length > 0 && <Summary data={selectedPoke}/>}
      </div>
    </div>
  )
}

export default App
