import { Link } from "react-router";
import type { Image } from "~/utils/mockData";

interface MainImageProps {
  image: Image;
}

export function MainImage({ image }: MainImageProps) {
  return (
    <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl shadow-black/50 border border-white/5">
        <img
          src={image.url}
          alt={image.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            {image.title}
          </h1>
          <div className="flex items-center gap-4 text-zinc-300">
            <span className="text-lg">by {image.author}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
            <span className="text-sm font-mono uppercase tracking-wider">{image.date}</span>
          </div>
          <div className="flex gap-2 mt-4">
            {image.tags.map((tag) => (
              <Link
                key={tag}
                to={`/?tag=${tag}`}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-sm text-white transition-colors border border-white/10"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
        <Link
          to="/"
          className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-colors border border-white/10"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
