"use client";

import { useEffect, useState } from "react";
import { Photo } from "./api/photos/route";

async function getPhotos() {
  const res = await fetch(`/api/photos`, {
    next: { revalidate: 60 },
  });
  const data = await res.json();

  return data.photos;
}

export default function Home() {
  const PERIOD_SEC = 10;
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photo, setPhoto] = useState<Photo>();
  const [currentTime, setCurrentTime] = useState<Date>();

  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    (async () => {
      const photos = await getPhotos();
      setPhotos(photos);
    })();
  }, []);

  function prefetch(url: string) {
    new Image().src = url;
  }

  useEffect(() => {
    if (!currentTime) return;

    const numPhotos = photos.length;
    if (numPhotos === 0) return;

    const sec = currentTime?.getTime() / 1000;

    const index = Math.floor(sec / PERIOD_SEC) % numPhotos;
    const nextIndex = (index + 1) % numPhotos;

    prefetch(photos[nextIndex].url);
    setPhoto(photos[index]);
  }, [photos, currentTime]);

  return (
    <main>
      {photo && <img src={photo.url}></img>}
      {currentTime && currentTime.toString()}
    </main>
  );
}