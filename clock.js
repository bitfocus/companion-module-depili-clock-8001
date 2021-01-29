const OSC = require('osc');
const instance_skel = require('../../instance_skel');
const actions = require('./actions');
const presets = require('./presets');

let debug;
let log;

class instance extends instance_skel {
  constructor(system, id, config) {
    super(system, id, config);

    Object.assign(this, { ...actions });
    Object.assign(this, { ...presets });

    this.feedbackstate = {
      time: '00:00:00',
      tally: '',
      mode: '0',
      paused: '0',
    };

    this.actions();
  }

  // Return config fields for web config
  config_fields() {
    return [
      {
        type: 'dropdown',
        id: 'version',
        label: 'Clock protocol version',
        choices: [
          { id: '4', label: 'Version 4' },
          { id: '3', label: 'Version 3' },
          { id: 'mixed', label: 'Versions 3 & 4, not recommended' },
        ],
      },
      {
        type: 'textinput',
        id: 'host',
        label: 'Clock IP address (you can also use broadcast)',
        width: 8,
        regex: this.REGEX_IP,
      },
      {
        type: 'textinput',
        id: 'port',
        label: 'Target Port',
        width: 4,
        regex: this.REGEX_PORT,
        default: 1245,
      },
      {
        type: 'textinput',
        id: 'localport',
        label: 'Local Port',
        width: 4,
        regex: this.REGEX_PORT,
        default: 1245,
      },
    ];
  }

  updateConfig(config) {
    this.config = config;
    this.init_osc();
    this.actions();
    this.init_presets();
  }

  init() {
    debug = this.debug;
    this.init_osc();
    this.init_variables();
    this.init_presets();
    this.init_feedbacks();
    this.status(this.STATE_OK);
  }

  init_feedbacks() {
    const feedbacks = {
      state_color: {
        label: 'Change color from state',
        description: 'Change the colors of a bank according to the timer state',
        options: [
          {
            type: 'colorpicker',
            label: 'Normal: Foreground color',
            id: 'normal_fg',
            default: this.rgb(255, 255, 255),
          },
          {
            type: 'colorpicker',
            label: 'Normal: Background color',
            id: 'normal_bg',
            default: this.rgb(255, 0, 0),
          },
          {
            type: 'colorpicker',
            label: 'Countdown: Foreground color',
            id: 'countdown_fg',
            default: this.rgb(255, 255, 255),
          },
          {
            type: 'colorpicker',
            label: 'Countdown: Background color',
            id: 'countdown_bg',
            default: this.rgb(255, 0, 0),
          },
          {
            type: 'colorpicker',
            label: 'Paused countdown: Foreground color',
            id: 'paused_fg',
            default: this.rgb(128, 128, 128),
          },
          {
            type: 'colorpicker',
            label: 'Paused Countdown: Background color',
            id: 'paused_bg',
            default: this.rgb(128, 0, 0),
          },
          {
            type: 'colorpicker',
            label: 'Count up: Foreground color',
            id: 'countup_fg',
            default: this.rgb(255, 255, 255),
          },
          {
            type: 'colorpicker',
            label: 'Count up: Background color',
            id: 'countup_bg',
            default: this.rgb(255, 0, 0),
          },
          {
            type: 'colorpicker',
            label: 'Off: Foreground color',
            id: 'off_fg',
            default: this.rgb(255, 255, 255),
          },
          {
            type: 'colorpicker',
            label: 'Off: Background color',
            id: 'off_bg',
            default: this.rgb(0, 0, 0),
          },
        ],
      },
      pause_color: {
        label: 'Change color from pause',
        description: 'Change the colors of a bank according to the pause state',
        options: [
          {
            type: 'colorpicker',
            label: 'Running: Foreground color',
            id: 'running_fg',
            default: this.rgb(255, 255, 255),
          },
          {
            type: 'colorpicker',
            label: 'Running: Background color',
            id: 'running_bg',
            default: this.rgb(255, 0, 0),
          },
          {
            type: 'colorpicker',
            label: 'Paused: Foreground color',
            id: 'paused_fg',
            default: this.rgb(255, 255, 255),
          },
          {
            type: 'colorpicker',
            label: 'Paused: Background color',
            id: 'paused_bg',
            default: this.rgb(0, 0, 0),
          },
        ],
      },
    };
    this.setFeedbackDefinitions(feedbacks);
  }

  feedback(feedback) {
    if (feedback.type === 'state_color') {
      if (this.feedbackstate.state === '0') {
        return {
          color: feedback.options.normal_fg,
          bgcolor: feedback.options.normal_bg,
        };
      }
      if (this.feedbackstate.state === '1') {
        return {
          color: feedback.options.countdown_fg,
          bgcolor: feedback.options.countdown_bg,
        };
      }
      if (this.feedbackstate.state === '2') {
        return {
          color: feedback.options.countup_fg,
          bgcolor: feedback.options.countup_bg,
        };
      }
      if (this.feedbackstate.state === '3') {
        return {
          color: feedback.options.off_fg,
          bgcolor: feedback.options.off_bg,
        };
      }
    }
    if (feedback.type === 'pause_color') {
      if (this.feedbackstate.paused === '1') {
        return {
          color: feedback.options.paused_fg,
          bgcolor: feedback.options.paused_bg,
        };
      }
      return {
        color: feedback.options.running_fg,
        bgcolor: feedback.options.running_bg,
      };
    }
    return {};
  }

  init_variables() {
    const variables = [
      {
        label: 'State of timer (NORMAL, COUNTUP, COUNTDOWN, OFF)',
        name: 'state',
      },
      {
        label: 'Current time of timer (hh:mm:ss)',
        name: 'time',
      },
      {
        label: 'Current time of timer (hh:mm)',
        name: 'time_hm',
      },
      {
        label: 'Current time of timer (hours)',
        name: 'time_h',
      },
      {
        label: 'Current time of timer (minutes)',
        name: 'time_m',
      },
      {
        label: 'Current time of timer (seconds)',
        name: 'time_s',
      },
      {
        label: 'Current tally text',
        name: 'tally',
      },
      {
        label: 'Pause state',
        name: 'paused',
      },
    ];
    this.updateState();
    this.setVariableDefinitions(variables);
  }

  updateState() {
    const info = this.feedbackstate.time.split(':');
    const states = {
      0: 'NORMAL',
      1: 'COUNTDOWN',
      2: 'COUNTUP',
      3: 'OFF',
      4: 'PAUSED',
    };
    const pause = {
      0: 'Run\\nning',
      1: 'Pau\\nsed',
    };

    if (info[0].length === 0) {
      this.setVariable('time', `${info[1]}:${info[2]}`);
      this.setVariable('time_hm', `00:${info[1]}`);
    } else {
      this.setVariable('time', this.feedbackstate.time);
      this.setVariable('time_hm', `${info[0]}:${info[1]}`);
    }
    this.setVariable('time_h', info[0]);
    this.setVariable('time_m', info[1]);
    this.setVariable('time_s', info[2]);
    this.setVariable('state', states[this.feedbackstate.state]);
    this.setVariable('tally', this.feedbackstate.tally);
    this.setVariable('paused', pause[this.feedbackstate.paused]);
  }

  init_osc() {
    if (this.listener) {
      this.listener.close();
    }
    this.listener = new OSC.UDPPort({
      localAddress: '0.0.0.0',
      localPort: this.config.localport,
      metadata: true,
    });
    this.listener.open();
    this.listener.on('ready', function setReady() {
      this.ready = true;
    });
    this.listener.on('message', function processMessage(message) {
      let a;
      let mode;
      if (message.address.match(/^\/clock\/state/)) {
        if (message.args.length >= 5) {
          a = message.args;
          mode = a[0].value;
          this.feedbackstate.state = mode;
          this.feedbackstate.time = `${a[1].value}:${a[2].value}:${a[3].value}`;
          this.feedbackstate.tally = a[4].value;
          this.updateState();
          this.checkFeedbacks('state_color');
        }
        if (message.args.length === 6) {
          this.feedbackstate.paused = message.args[5].value;
          this.checkFeedbacks('pause_color');
        }
      }
    });
  }

  // When module gets deleted
  destroy() {
    if (this.listener) {
      this.listener.close();
    }
    debug('destroy');
  }

  actions() {
    this.setActions(this.getActions());
  }

  action(action) {
    this.doAction(action);
  }

  init_presets() {
    this.setPresetDefinitions(this.getPresets());
  }
}

module.exports = instance;
exports = module.exports;
