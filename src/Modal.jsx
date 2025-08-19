export default function Modal({ movie, onClose, isClosing }) {
  if (!movie) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        isClosing ? "animate-fadeOut" : "animate-fadeIn"
      }`}
    >
      <div
        className={`bg-gray-900 rounded-lg p-5 max-w-2xl w-full relative transform transition-all duration-300 ${
          isClosing ? "animate-scaleOut" : "animate-scaleIn"
        }`}
      >
        {/* Botón cerrar */}
        <button
          className="absolute top-2 right-2 text-white text-2xl hover:text-red-500 cursor-pointer"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Título */}
        <h2 className="text-2xl font-bold mb-3">{movie.title}</h2>

        {/* Descripción */}
        <p className="text-gray-300 mb-4 text-xs">
          {movie.overview || "Sin descripción disponible."}
        </p>

        {/* Trailer */}
        {movie.trailer ? (
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              className="w-full h-64 rounded-lg"
              src={`https://www.youtube.com/embed/${movie.trailer}`}
              title="Trailer"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <p className="text-gray-400">No hay trailer disponible.</p>
        )}
      </div>
    </div>
  );
}

  
