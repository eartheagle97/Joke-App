"use client";
import Initial from "./Initial.gif";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [joke, setJoke] = useState("");
  const [setup, setSetup] = useState("");
  const [punchline, setPunchline] = useState("");

  const fetchJoke = async () => {
    try {
      const response = await fetch(
        "https://official-joke-api.appspot.com/random_joke"
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching joke:", error);
      return null;
    }
  };

  const speakJoke = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = handleJokeEnd;
    speechSynthesis.speak(utterance);
  };

  const handleJokeEnd = () => {
    setTimeout(() => {
      const audio = new Audio("/laughing-sound.wav");
      audio.play();
    }, 500);
  };

  const handleButtonClick = async () => {
    const jokeData = await fetchJoke();
    if (jokeData) {
      const fullJoke = `${jokeData.setup} ${jokeData.punchline}`;
      setJoke(fullJoke);
      setSetup(jokeData.setup);
      setPunchline(jokeData.punchline);
    } else {
      setJoke("Failed to fetch joke. Please try again later.");
    }
  };

  useEffect(() => {
    if (joke) {
      speakJoke(joke);
    }
  }, [joke]);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <Image src={Initial} width={500} height={500} alt="Robot" />
      {joke && (
        <div className="text-center font-mono md:w-3/5 sm:w-2/3 bg-white p-12 mt-4 mb-8 rounded-xl m-12">
          <p>{setup}</p>
          <p className="mt-8">"{punchline}"</p>
        </div>
      )}
      <button
        onClick={handleButtonClick}
        className="font-mono bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-2 px-4 border-b-4 border-yellow-500 hover:border-yellow-300 rounded"
      >
        Tell me a Joke!
      </button>
      <p className="font-mono text-white mt-28 text-center text-sm">
        &copy; {new Date().getFullYear()} |{" "}
        <a
          href="https://github.com/eartheagle97/"
          className="text-yellow-400"
          target="_blank"
        >
          Kairav Patel
        </a>{" "}
        | All Rights Reserved.
      </p>
    </main>
  );
}
