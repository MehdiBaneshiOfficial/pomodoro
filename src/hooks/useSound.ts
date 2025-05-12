import { useCallback, useRef } from 'react';

interface SoundOptions {
  volume?: number;
}

type SoundType = 'timerStart' | 'timerPause' | 'timerComplete' | 'timerReset' | 'timerSkip';

export default function useSound() {
  const audioCache = useRef<Map<string, HTMLAudioElement>>(new Map());
  
  // Different sound URLs based on sound type
  const getSoundUrl = (type: SoundType): string => {
    switch (type) {
      case 'timerComplete':
        return 'https://raw.githubusercontent.com/freeCodeCamp/cdn/main/build/testable-projects-fcc/audio/BeepSound.mp3';
      case 'timerStart':
        return 'https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample.mp3';
      case 'timerPause':
        return 'https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample2.mp3';
      case 'timerReset':
        return 'https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample3.mp3';
      case 'timerSkip':
        return 'https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample4.mp3';
      default:
        return 'https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample.mp3';
    }
  };

  const playSound = useCallback((type: SoundType, options: SoundOptions = {}) => {
    const { volume = 0.5 } = options;
    
    try {
      const soundUrl = getSoundUrl(type);
      
      // Check if we have the audio in cache
      let audio = audioCache.current.get(soundUrl);
      
      if (!audio) {
        audio = new Audio(soundUrl);
        audioCache.current.set(soundUrl, audio);
      }
      
      // Reset the audio to the start if it's already playing
      audio.currentTime = 0;
      audio.volume = volume;
      
      // Play the sound
      audio.play().catch(error => {
        console.error('Error playing sound:', error);
        // Often caused by browser autoplay restrictions
      });
    } catch (error) {
      console.error('Error in playSound:', error);
    }
  }, []);

  return {
    playSound
  };
}