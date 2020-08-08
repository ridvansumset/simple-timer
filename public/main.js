const app = new Vue({
  el: '#app',
  data() {
    return {
      endTime: 60,
      distance: 60,
      endDate: 0,
      interval: '',
      bgColor: '#fff',
      autoRefresh: true,
      showSettings: false,
      isStopped: true,
      userClicked: false,
      m: 1,
      s: 0,
    };
  },
  watch: {
    endTime() {
      this.stopTimer();
      this.userClicked = false;
      this.m = Math.floor(this.endTime / 60);
      this.s = this.endTime % 60;
    },
  },
  methods: {
    stopTimer() {
      clearInterval(this.interval);
      this.isStopped = true;
    },
    startTimer(isContinue) {
      clearInterval(this.interval);
      this.isStopped = false;
      this.userClicked = true;
      this.bgColor = '#fff';

      const timeToAdd = isContinue ? Number(this.distance) : Number(this.endTime);
      this.endDate = Math.floor(new Date().getTime() / 1000) + Math.floor(timeToAdd);

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
          this.startTimer(false);
        }
      } else {
        if (distance < 4) {
          if (distance > 0) {
            this.beep();
          }
          this.bgColor = 'lightcoral';
        } else {
          this.bgColor = '#fff';
        }
        this.m = Math.floor(distance / 60);
        this.s = distance % 60;
      }
    },
    doubleDigits(t) {
      return t > 9 ? t : `0${t}`;
    },
    beep() {
      const audio = new Audio('beep.mp3');
      audio.play();
    },
  },
});
