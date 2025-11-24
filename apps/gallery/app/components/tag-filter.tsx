import { useSearchParams, Link } from "react-router";
import { ALL_TAGS } from "~/utils/mockData";

export function TagFilter() {
  const [searchParams] = useSearchParams();
  const currentTag = searchParams.get("tag");

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Link
        to="/"
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${!currentTag
          ? "bg-zinc-100 text-zinc-900 border-zinc-100"
          : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-zinc-200"
          }`}
      >
        All
      </Link>
      {ALL_TAGS.map((tag) => (
        <Link
          key={tag}
          to={`/?tag=${tag}`}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${currentTag === tag
            ? "bg-zinc-100 text-zinc-900 border-zinc-100"
            : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-zinc-200"
            }`}
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
}