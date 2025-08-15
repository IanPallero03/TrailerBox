import { useEffect, useState } from "react";
import { API_KEY, BASE_URL, IMAGE_BASE_URL } from "./Config";
import Modal from "./Modal";


function App() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [search, setSearch] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [genres, setGenres] = useState([]);


const handleCloseModal = () => {
  setIsClosing(true);
  setTimeout(() => {
    setSelectedMovie(null);
    setIsClosing(false);
  }, 300); // mismo tiempo que la animación
};

const getGenres = async () => {
  const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=es-ES`);
  const data = await res.json();
  setGenres(data.genres);
};

useEffect(() => {
  getPopularMovies();
}, []);

useEffect(() => {
  getGenres();
}, []);


{/* Seccion Flecha hacia arriba */}
useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowScroll(true);
    } else {
      setShowScroll(false);
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};


{/* Seccion invocar peliculas */}

const getPopularMovies = async () => {
  let allMovies = [];

  // Cambia este número según cuántas páginas quieras traer
  const totalPagesToFetch = 10;

  for (let page = 1; page <= totalPagesToFetch; page++) {
    const res = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES&page=${page}`
    );
    const data = await res.json();

    // Sumamos las películas de esta página al array general
    allMovies = [...allMovies, ...data.results];
  }

  setMovies(allMovies);
};

{/* Buscador de trailer en español e ingles */}

const fetchTrailer = async (movieId) => {
  // Buscar en español primero
  let res = await fetch(
    `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=es-ES`
  );
  let data = await res.json();
  let trailer = data.results.find(
    (vid) => vid.type === "Trailer" && vid.site === "YouTube"
  );

  // Si no hay en español, buscar en inglés
  if (!trailer) {
    res = await fetch(
      `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
    );
    data = await res.json();
    trailer = data.results.find(
      (vid) => vid.type === "Trailer" && vid.site === "YouTube"
    );
  }

  return trailer ? trailer.key : null;
};


  const handleMovieClick = async (movie) => {
    const trailerKey = await fetchTrailer(movie.id);
    setSelectedMovie({ ...movie, trailer: trailerKey });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (search.trim() === "") {
      getPopularMovies();
      return;
    }

    const res = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${search}`
    );
    const data = await res.json();
    setMovies(data.results);
  };

  {/* Seccion de categorias */}
  const categories = [
    { id: "popular", name: "Populares" },
    { id: "top_rated", name: "Mejor Valoradas" },
    { id: "now_playing", name: "En Cartelera" },
    { id: "upcoming", name: "Próximamente" }
  ];
  
  const getMoviesByCategory = async (category) => {
    setMovies([]); // Vacía el grid antes de cargar las nuevas
    setSelectedMovie(null); // Cierra modal si estaba abierto
    window.scrollTo(0, 0);
  
    let allMovies = [];
    const totalPagesToFetch = 3;
  
    for (let page = 1; page <= totalPagesToFetch; page++) {
      const res = await fetch(
        `${BASE_URL}/movie/${category}?api_key=${API_KEY}&language=es-ES&page=${page}`
      );
      const data = await res.json();
      allMovies = [...allMovies, ...data.results];
    }
  
    setMovies(allMovies);
  };
  
  const getMoviesByGenre = async (genreId) => {
    setMovies([]);
    setSelectedMovie(null);
    window.scrollTo(0, 0);
  
    let allMovies = [];
    const totalPagesToFetch = 2;
  
    for (let page = 1; page <= totalPagesToFetch; page++) {
      const res = await fetch(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=es-ES&with_genres=${genreId}&page=${page}`
      );
      const data = await res.json();
      allMovies = [...allMovies, ...data.results];
    }
  
    setMovies(allMovies);
  };
  
  

  return (
    
    <div className="p-5 min-h-screen bg-gradient-to-b from-black to-gray-500 text-white ">
      {/* HEADER */}
      <header className="mb-8 text-center ">
  <h1 className="text-5xl font-extrabold text-red-500 tracking-wide drop-shadow-lg ">
    🎬 TrailerHub
  </h1>
  <p className="text-gray-400 mt-2 text-lg">
    Explora y mira trailers de tus películas favoritas
  </p>
</header>


      {/* Seccion Buscador */}
      <form onSubmit={handleSearch} className="flex justify-center mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Buscar película..."
          className="w-full max-w-md px-4 py-2 rounded-l-full border outline-none text-white "
        />
        <button
          type="submit"
          className="bg-red-500 px-6 py-2 rounded-r-full text-white font-bold hover:bg-red-600 transition-colors cursor-pointer"
        >
          Buscar
        </button>
      </form>

{/* Seccion Categorías */}
<div className="mb-8">
  <div className="text-center mb-6">
    <h2 className="text-2xl font-bold text-white mb-2">🎞️ Categorías</h2>
    <p className="text-gray-400 text-sm">
      Explora las películas según su tipo
    </p>
  </div>

  <div className="flex flex-wrap justify-center gap-3 mb-6">
    {categories.map((cat) => (
      <button
        key={cat.id}
        onClick={() => getMoviesByCategory(cat.id)}
        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                   px-5 py-2 rounded-xl text-white font-semibold shadow-lg 
                   hover:shadow-red-500/40 transform hover:scale-105 transition-all duration-300 cursor-pointer"
      >
        {cat.name}
      </button>
    ))}
  </div>

  {/* Seccion Géneros */}
  <div className="text-center mb-4">
    <h2 className="text-2xl font-bold text-white mb-2">🎥 Géneros</h2>
    <p className="text-gray-400 text-sm">
      Filtra las películas por género
    </p>
  </div>

  <div className="flex flex-wrap justify-center gap-2">
    {genres.map((genre) => (
      <button
        key={genre.id}
        onClick={() => getMoviesByGenre(genre.id)}
        className="bg-gray-800 hover:bg-red-500 px-4 py-2 rounded-xl 
                   text-white text-sm font-semibold shadow-md 
                   hover:shadow-red-500/30 transform hover:scale-105 transition-all duration-300 cursor-pointer"
      >
        {genre.name}
      </button>
    ))}
  </div>
</div>


      {/* Seccion Grid de películas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
        {movies.map((movie) => (
         <div
         key={movie.id}
         className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-red-500/40 hover:scale-105 transition duration-300 cursor-pointer"
         onClick={() => handleMovieClick(movie)}
       >
         <img
           src={`${IMAGE_BASE_URL}${movie.poster_path}`}
           alt={movie.title}
           className="w-full h-80 object-cover"
         />
         <div className="p-3">
           <h2 className="text-lg font-semibold truncate">{movie.title}</h2>
           <p className="text-gray-400 text-sm">{movie.release_date}</p>
         </div>
       </div>
       
        ))}
      </div>

{/* Seccion boton flecha hacia arriba*/}
      {showScroll && (
  <button
  onClick={scrollToTop}
  className="fixed bottom-6 right-6 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:shadow-red-500/50 hover:scale-110 transition-transform duration-300 cursor-pointer flex items-center justify-center"
  aria-label="Scroll to top"
>
  {/* Icono de flecha hacia arriba */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 15l7-7 7 7"
    />
  </svg>
</button>

)}


      {/* Modal */}
      {selectedMovie && (
  <Modal
    movie={selectedMovie}
    onClose={handleCloseModal}
    isClosing={isClosing}
  />
)}

    </div>
  );
}

export default App;
