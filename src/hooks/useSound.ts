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
        return 'https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3';
      case 'timerStart':
        return 'https://assets.mixkit.co/sfx/preview/mixkit-mouse-click-close-1113.mp3';
      case 'timerPause':
        return 'https://assets.mixkit.co/sfx/preview/mixkit-interface-click-1126.mp3';
      case 'timerReset':
        return 'https://assets.mixkit.co/sfx/preview/mixkit-plastic-bubble-click-1124.mp3';
      case 'timerSkip':
        return 'https://assets.mixkit.co/sfx/preview/mixkit-fast-small-sweep-transition-166.mp3';
      default:
        return 'https://assets.mixkit.co/sfx/preview/mixkit-interface-click-1126.mp3';
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