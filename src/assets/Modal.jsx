export default function Modal({ movie, onClose }) {
    if (!movie) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-lg p-5 max-w-lg w-full relative">
          <button
            className="absolute top-2 right-2 text-white text-2xl"
            onClick={onClose}
          >
            ✖
          </button>
          <h2 className="text-2xl font-bold mb-3">{movie.title}</h2>
          <p className="text-gray-300 mb-4">{movie.overview}</p>
          {movie.trailer && (
            <iframe
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${movie.trailer}`}
              title="Trailer"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </div>
    );
  }
  
  