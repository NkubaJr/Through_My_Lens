import { Link } from 'react-router-dom';

export default function ArtworkCard({ artwork }) {
  return (
    <Link to={`/artwork/${artwork.artwork_id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-56 overflow-hidden">
          <img
            src={artwork.file_url}
            alt={artwork.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 bg-earth-800 text-earth-100 text-xs px-2 py-1 rounded-full">
            {artwork.category}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-earth-800 text-lg truncate">{artwork.title}</h3>
          <p className="text-earth-600 text-sm mt-1">by {artwork.username}</p>
          <p className="text-earth-500 text-xs mt-1">{artwork.country}</p>
          <p className="text-earth-700 text-sm mt-2 line-clamp-2">{artwork.story}</p>
        </div>
      </div>
    </Link>
  );
}