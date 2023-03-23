const MAX_VALUE = 60000;

const app = new Vue({
  el: '#app',
  data() {
    return {
      isWorking: false,
      endTime: 60,
      restTime: '',
      distance: 60,
      endDate: 0,
      interval: '',
      intervalCount: 0,
      bgColor: '#fff',
      beepStyle: '2',
      autoRefresh: true,
      soundOn: false,
      showSettings: false,
      isStopped: true,
      userClicked: false,
      audio: null,
      m: 1,
      s: 0,
    };
  },
  watch: {
    endTime() {
      this.stopTimer();
      this.userClicked = false;
      this.bgColor = '#fff';
      this.endTime = this.checkTime(this.endTime);
      this.m = Math.floor(this.endTime / 60);
      this.s = this.endTime % 60;
    },
    restTime() {
      this.stopTimer();
      this.userClicked = false;
      this.bgColor = '#fff';
      this.restTime = this.checkTime(this.restTime);
      this.m = Math.floor(this.endTime / 60);
      this.s = this.endTime % 60;
    },
  },
  methods: {
    stopTimer() {
      clearInterval(this.interval);
      this.isStopped = true;
    },
    startWorkTimer(isContinue) {
      clearInterval(this.interval);

      if (this.endTime < 1) {
        this.isStopped = true;
        return;
      }

      this.isWorking = true;
      this.userClicked = true;
      this.bgColor = '#fff';

      if (!isContinue) {
        this.intervalCount += 1;
      }

      const timeToAdd = isContinue ? Number(this.distance) : Number(this.endTime);
      this.endDate = Math.floor(new Date().getTime() / 1000) + Math.floor(timeToAdd);

      this.isStopped = false;

      this.countdown(this.endDate);
      this.interval = setInterval(() => this.countdown(this.endDate), 1000);
    },
    startRestTimer(isContinue) {
      clearInterval(this.interval);
      this.isWorking = false;
      this.userClicked = true;
      this.bgColor = '#fff';

      const timeToAdd = isContinue ? Number(this.distance) : Number(this.restTime);
      this.endDate = Math.floor(new Date().getTime() / 1000) + Math.floor(timeToAdd);

      this.isStopped = false;

      this.countdown(this.endDate);
      this.interval = setInterval(() => this.countdown(this.endDate), 1000);
    },
    countdown(end) {
      const distance = end - Math.floor(new Date().getTime() / 1000);
      this.distance = distance;

      if (distance < 0) {
        this.m = 0;
        this.s = 0;
        clearInterval(this.interval);
        if (this.autoRefresh) {
          if (this.isWorking && this.restTime > 0) {
            this.startRestTimer(false);
          } else {
            this.startWorkTimer(false);
          }
        }
      } else {
        if (this.isWorking) {
          if (distance < 4) {
            if (this.beepStyle === '2' && distance > 0 && this.soundOn) {
              this.beep();
            } else if (this.beepStyle === '1' && distance === 0 && this.soundOn) {
              this.beep();
            }
            this.bgColor = 'lightcoral';
          } else {
            this.bgColor = '#fff';
          }
        } else {
          this.bgColor = 'olivedrab';
          if (distance < 5) {
            if (distance > 0 && this.soundOn) {
              this.tick();
            }
            // this.bgColor = 'lightpink';
          }
        }
        this.m = Math.floor(distance / 60);
        this.s = distance % 60;
      }
    },
    doubleDigits(t) {
      return t > 9 ? t : `0${t}`;
    },
    checkTime(t) {
      if (t > MAX_VALUE) {
        t = MAX_VALUE;
      } else if (t < 1) {
        t = '';
      }
      return t;
    },
    onSelect(e) {
      this.beepStyle = e.target.value;
    },
    beep() {
      const audio = new Audio('beep.mp3');
      audio.play();
    },
    tick() {
      const audio = new Audio('tick.mp3');
      audio.play();
      setTimeout(() => {
        audio.pause();
        audio.muted = true;
        audio.loop = false;
      }, 1000);
    },
  },
});
