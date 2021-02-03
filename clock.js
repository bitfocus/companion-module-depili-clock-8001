const OSC = require('osc');
const instance_skel = require('../../instance_skel');
const actions = require('./actions');
const presets = require('./presets');

let debug;
let log;

class instance extends instance_skel {
  constructor(system, id, config) {
    let i;
    super(system, id, config);

    Object.assign(this, { ...actions });
    Object.assign(this, { ...presets });

    this.feedbackState = {
      time: '00:00:00',
      tally: '',
      mode: '0',
      paused: '0',
      timers: [],
      sources: [],
      uuid: '',
      timestamp: Date.now(),
    };

    for (i = 0; i < 10; i++) {
      this.feedbackState.timers.push({
        active: false,
        time: '00:00:00',
        compact: '',
        icon: '',
        paused: false,
        expired: false,
        progress: 1.0,
      });
    }

    // Source array index 0 is unused, only there to help with indexing...
    for (i = 0; i < 5; i++) {
      this.feedbackState.sources.push({
        hidden: true,
        time: '00:00:00',
        compact: '',
        icon: '',
        paused: false,
        expired: false,
        progress: 1.0,
        mode: 0,
        title: '',
      });
    }

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
    this.actions();
    this.init_presets();
    this.init_osc();
  }

  init() {
    debug = this.debug;
    this.init_variables();
    this.init_presets();
    this.init_feedbacks();
    this.init_osc();
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
      if (this.feedbackState.state === '0') {
        return {
          color: feedback.options.normal_fg,
          bgcolor: feedback.options.normal_bg,
        };
      }
      if (this.feedbackState.state === '1') {
        return {
          color: feedback.options.countdown_fg,
          bgcolor: feedback.options.countdown_bg,
        };
      }
      if (this.feedbackState.state === '2') {
        return {
          color: feedback.options.countup_fg,
          bgcolor: feedback.options.countup_bg,
        };
      }
      if (this.feedbackState.state === '3') {
        return {
          color: feedback.options.off_fg,
          bgcolor: feedback.options.off_bg,
        };
      }
    }
    if (feedback.type === 'pause_color') {
      if (this.feedbackState.paused === '1') {
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
    let i;
    let variables = [
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

    for (i = 0; i < 10; i++) {
      variables = variables.concat([
        {
          label: `Timer ${i} icon`,
          name: `timer_${i}_icon`,
        },
        {
          label: `Timer ${i} hours`,
          name: `timer_${i}_hours`,
        },
        {
          label: `Timer ${i} minutes`,
          name: `timer_${i}_minutes`,
        },
        {
          label: `Timer ${i} seconds`,
          name: `timer_${i}_seconds`,
        },
      ]);
    }

    for (i = 1; i < 5; i++) {
      variables = variables.concat([
        {
          label: `Source ${i} icon`,
          name: `source_${i}_icon`,
        },
        {
          label: `Source ${i} hours`,
          name: `source_${i}_hours`,
        },
        {
          label: `Source ${i} minutes`,
          name: `source_${i}_minutes`,
        },
        {
          label: `Source ${i} seconds`,
          name: `source_${i}_seconds`,
        },
      ]);
    }

    this.updateState();
    this.setVariableDefinitions(variables);
  }

  updateState() {
    let i;

    // Timers
    for (i = 0; i < 10; i++) {
      this.updateTimerVariables(i);
    }

    // Sources
    for (i = 1; i < 5; i++) {
      this.updateSourceVariables(i);
    }

    this.updateLegacyState();
  }

  updateTimerVariables(timer) {
    let hours;
    let mins;
    let secs;
    let icon;

    if (this.feedbackState.timers[timer].active) {
      const parts = this.feedbackState.timers[timer].time.split(':');
      if (parts.length === 4) {
        // LTC active
        icon = parts[0];
        hours = parts[1];
        mins = parts[2];
        secs = parts[3];
      } else if (parts.length === 3) {
        icon = this.feedbackState.timers[timer].icon;
        hours = parts[0];
        mins = parts[1];
        secs = parts[2];
      } else {
        hours = '';
        mins = '';
        secs = '';
        icon = '';
      }
    } else {
      hours = '';
      mins = '';
      secs = '';
      icon = '';
    }

    // Replace the pause symbol with something in the font Companion uses
    icon = icon.replace('Ⅱ', '⏸︎');

    this.setVariable(`timer_${timer}_icon`, icon);
    this.setVariable(`timer_${timer}_hours`, hours);
    this.setVariable(`timer_${timer}_minutes`, mins);
    this.setVariable(`timer_${timer}_seconds`, secs);
  }


  updateSourceVariables(source) {
    let hours;
    let mins;
    let secs;
    let icon;

    if (this.feedbackState.sources[source].hidden === false) {
      const parts = this.feedbackState.sources[source].time.split(':');
      if (parts.length === 4) {
        // LTC active
        icon = parts[0];
        hours = parts[1];
        mins = parts[2];
        secs = parts[3];
      } else if (parts.length === 3) {
        icon = this.feedbackState.sources[source].icon;
        hours = parts[0];
        mins = parts[1];
        secs = parts[2];
      } else {
        hours = '';
        mins = '';
        secs = '';
        icon = '';
      }
    } else {
      hours = '';
      mins = '';
      secs = '';
      icon = '';
    }
    // Replace the pause symbol with something in the font Companion uses
    icon = icon.replace('Ⅱ', '⏸︎');

    this.setVariable(`source_${source}_icon`, icon);
    this.setVariable(`source_${source}_hours`, hours);
    this.setVariable(`source_${source}_minutes`, mins);
    this.setVariable(`source_${source}_seconds`, secs);
  }

  updateLegacyState() {
    const info = this.feedbackState.time.split(':');
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
      this.setVariable('time', this.feedbackState.time);
      this.setVariable('time_hm', `${info[0]}:${info[1]}`);
    }
    this.setVariable('time_h', info[0]);
    this.setVariable('time_m', info[1]);
    this.setVariable('time_s', info[2]);
    this.setVariable('state', states[this.feedbackState.state]);
    this.setVariable('tally', this.feedbackState.tally);
    this.setVariable('paused', pause[this.feedbackState.paused]);
  }

  init_osc() {
    const statePattern = /^\/clock\/(timer|source)\/([0-9])\/state/;
    const timerPattern = /^\/clock\/timer\/([0-9])\/state/;
    const sourcePattern = /^\/clock\/source\/([1-4])\/state/;
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
      debug('ready');
    });
    this.listener.on('message', (message) => {
      let a;
      let mode;

      // Legacy V3 state message
      if (message.address.match(/^\/clock\/state/)) {
        if (message.args.length >= 5) {
          a = message.args;
          mode = a[0].value;
          this.feedbackState.state = mode;
          this.feedbackState.time = `${a[1].value}:${a[2].value}:${a[3].value}`;
          this.feedbackState.tally = a[4].value;
          this.updateLegacyState();
          this.checkFeedbacks('state_color');
        }
        if (message.args.length === 6) {
          this.feedbackState.paused = message.args[5].value;
          this.updateLegacyState();
          this.checkFeedbacks('pause_color');
        }
      }

      // V4 state messages
      if (message.address.match(statePattern) && message.args.length > 0) {
        if (this.feedbackState.uuid === message.args[0].value || this.feedbackState.timestamp < Date.now() - 1000) {
          this.feedbackState.uuid = message.args[0].value;
          this.feedbackState.timestamp = Date.now();
        } else {
          // Missmatched UUID and previous clock hasn't timed out
          return;
        }

        // Timer state messages
        if (message.address.match(timerPattern)) {
          if (message.args.length === 8) {
            const timer = message.address.match(timerPattern)[1];
            const args = message.args;
            this.feedbackState.timers[timer] = {
              active: args[1].value,
              time: args[2].value,
              compact: args[3].value,
              icon: args[4].value,
              progress: args[5].value,
              expired: args[6].value,
              paused: args[7].value,
            };
            this.updateTimerVariables(timer);
          }
        } else if (message.address.match(sourcePattern)) {
          if (message.args.length === 10) {
            const source = message.address.match(sourcePattern)[1];
            const args = message.args;
            this.feedbackState.sources[source] = {
              hidden: args[1].value,
              time: args[2].value,
              compact: args[3].value,
              icon: args[4].value,
              progress: args[5].value,
              expired: args[6].value,
              paused: args[7].value,
              title: args[8].value,
              mode: args[9].value,
            };
            this.updateSourceVariables(source);
          }
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
