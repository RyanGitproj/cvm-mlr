"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/sections/SectionHeading";
import type { VideoContent } from "@/config/content/video";

/**
 * Section vidéo YouTube — façade « click-to-load » (RGPD/CNIL) : tant que le
 * visiteur n'a pas lancé la lecture, aucune requête vers Google ni cookie
 * tiers n'est émis. L'affiche est la miniature YouTube auto-hébergée
 * (`/images/video/{youtubeId}.jpg`, téléchargée une fois — pas de hotlink
 * vers ytimg qui rechargerait depuis Google à chaque visite). Au clic,
 * l'iframe youtube-nocookie remplace l'affiche et démarre. Les couleurs
 * viennent des tokens sémantiques (--accent…) : la section prend donc
 * automatiquement la charte de la page qui l'héberge (rouge Expédition, vert
 * Trek, lagon Îles, orange Grand Tour, terracotta MLR).
 */
export function VideoSection({ youtubeId, titre, description }: VideoContent) {
  const [playing, setPlaying] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  // Pause quand la vidéo sort de l'écran : le son ne doit jamais continuer
  // hors champ. Commande envoyée à l'embed déjà chargé via l'API iframe
  // YouTube (postMessage, activée par enablejsapi=1) — aucune requête ni
  // cookie supplémentaire. Pas de reprise automatique au retour dans le
  // champ : relancer la lecture reste un geste du visiteur.
  useEffect(() => {
    const frame = frameRef.current;
    if (!playing || frame === null) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.intersectionRatio < 0.25)) {
          frame.contentWindow?.postMessage(
            JSON.stringify({ event: "command", func: "pauseVideo", args: [] }),
            "https://www.youtube-nocookie.com",
          );
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, [playing]);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6">
      <SectionHeading titre={titre} sousTitre={description} align="center" />

      <div className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-2xl border-2 border-line bg-surface-2">
        <div className="relative aspect-video">
          {playing ? (
            <iframe
              ref={frameRef}
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`}
              title={`Vidéo — ${titre}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Lancer la vidéo — ${titre}`}
              className="group absolute inset-0"
            >
              <Image
                src={`/images/video/${youtubeId}.jpg`}
                alt={`Aperçu de la vidéo — ${titre}`}
                fill
                sizes="(min-width: 896px) 896px, 100vw"
                className="object-cover"
              />
              {/* Voile de lisibilité uniforme : le bouton et le libellé
                  restent nets sur n'importe quelle miniature ; s'assombrit
                  légèrement au survol. */}
              <span className="absolute inset-0 bg-veil/25 transition-colors duration-200 group-hover:bg-veil/40" />
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-contrast shadow-lg transition-transform duration-200 motion-safe:group-hover:scale-105 sm:h-20 sm:w-20">
                  <svg
                    aria-hidden
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="ml-1"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <span className="text-sm font-semibold uppercase tracking-wide text-on-veil drop-shadow">
                  Voir la vidéo
                </span>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
