export default function VideoPlayer({ url }) {
  if (!url) return null;
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (!["http:", "https:"].includes(parsed.protocol)) return null;
  const youtube =
    parsed.hostname === "youtu.be"
      ? parsed.pathname.slice(1)
      : ["youtube.com", "www.youtube.com"].includes(parsed.hostname)
        ? parsed.searchParams.get("v") || parsed.pathname.split("/").pop()
        : null;
  const vimeo = ["vimeo.com", "www.vimeo.com"].includes(parsed.hostname)
    ? parsed.pathname.split("/").pop()
    : null;
  const embed =
    youtube && /^[\w-]{11}$/.test(youtube)
      ? `https://www.youtube-nocookie.com/embed/${youtube}`
      : vimeo && /^\d+$/.test(vimeo)
        ? `https://player.vimeo.com/video/${vimeo}`
        : null;
  return (
    <div className="video-wrap">
      {embed ? (
        <iframe
          src={embed}
          title="Lesson video"
          allow="fullscreen; picture-in-picture"
          allowFullScreen
        />
      ) : /\.(mp4|webm|ogg)$/i.test(parsed.pathname) ? (
        <video src={url} controls preload="metadata" />
      ) : null}
      <a
        className="text-button mt-3"
        href={url}
        target="_blank"
        rel="noreferrer"
      >
        Open lesson video ↗
      </a>
    </div>
  );
}
