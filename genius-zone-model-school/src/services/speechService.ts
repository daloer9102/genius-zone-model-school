/**
 * Bengali Voice & Audio Announcement Service for Genius Zone Model School QR Attendance
 * Pronounces: "[Student Name], উপস্থিতি গ্রহণ করা হয়েছে।"
 */

class SpeechService {
  private audioCtx: AudioContext | null = null;

  /**
   * Play clean audio chime for instant feedback
   */
  public playSuccessChime() {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.audioCtx) {
        this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const ctx = this.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // AudioContext not available or blocked by user gesture
    }
  }

  public playWarningChime() {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.audioCtx) {
        this.audioCtx = new AudioCtx();
      }
      const ctx = this.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.setValueAtTime(250, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // AudioContext fallback
    }
  }

  /**
   * Speak attendance confirmation in Bengali
   * Example: "দেলোয়ার হোসেন, উপস্থিতি গ্রহণ করা হয়েছে।"
   */
  public speakAttendanceConfirmation(studentNameBangla: string, studentNameEnglish: string) {
    this.playSuccessChime();

    if (!('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // Cancel any previous speech

      const text = `${studentNameBangla || studentNameEnglish}, উপস্থিতি গ্রহণ করা হয়েছে।`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.lang = 'bn-BD';

      const voices = window.speechSynthesis.getVoices();
      const banglaVoice = voices.find(
        (v) => v.lang.startsWith('bn') || v.name.toLowerCase().includes('bangla') || v.name.toLowerCase().includes('bengali')
      );

      if (banglaVoice) {
        utterance.voice = banglaVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech synthesis error handled gracefully
    }
  }
}

export const speechService = new SpeechService();
