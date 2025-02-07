import gameStart from '../assets/sound/game_start.mp3';
import dogBark from '../assets/sound/dog_bark.mp3';
import gameOver from '../assets/sound/game_over.mp3';
import wrongInput from '../assets/sound/wrong_input.mp3';

class AudioPlayer {
  constructor() {
    this.sounds = {
      gameStart: new Audio(gameStart),
      dogBark: new Audio(dogBark),
      wrongInput: new Audio(wrongInput),
      gameOver: new Audio(gameOver),
    };

    this.sounds.dogBark.volume = 1.0;
    this.sounds.wrongInput.volume = 1.0;
    this.sounds.gameStart.volume = 0.15;
    this.sounds.gameStart.loop = true;
  }

  playSound(type) {
    const sound = this.sounds[type];
    if (sound) {
      sound.currentTime = 0; // 중복 재생 시 초기화
      sound.play().catch((error) => console.error('Audio play error:', error));
    } else {
      console.warn(`Sound type "${type}" is not defined.`);
    }
  }

  addSound(type, path) {
    if (this.sounds[type]) {
      console.warn(`Sound type "${type}" already exists.`);
      return;
    }
    this.sounds[type] = new Audio(path);
  }

  stopSound(type) {
    const sound = this.sounds[type];
    if (sound) {
      sound.pause(); // 재생 중단
      sound.currentTime = 0; // 초기화
    } else {
      console.warn(`Sound type "${type}" is not defined.`);
    }
  }
}

const audioPlayer = new AudioPlayer();
export default audioPlayer;
