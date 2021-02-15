exports.getActions = function getActions() {
  const actions = [];
  const timerOption = {
    type: 'textinput',
    label: 'Timer number',
    id: 'timer',
    default: 1,
    regex: this.REGEX_UNSIGNED_NUMBER,
  };
  const timerTimeOptions = [
    timerOption,
    {
      type: 'textinput',
      label: 'Timer (seconds)',
      id: 'secs',
      default: 0,
      regex: this.REGEX_UNSIGNED_NUMBER,
    },
    {
      type: 'textinput',
      label: 'Timer (minutes)',
      id: 'mins',
      default: 1,
      regex: this.REGEX_UNSIGNED_NUMBER,
    },
    {
      type: 'textinput',
      label: 'Timer (hours)',
      id: 'hours',
      default: 0,
      regex: this.REGEX_UNSIGNED_NUMBER,
    },
  ];
  const sourceOption = {
    type: 'textinput',
    label: 'Source number',
    id: 'source',
    default: 1,
    regex: this.REGEX_UNSIGNED_NUMBER,
  };
  actions.length = 0;

  if (this.config.version === '4' || this.config.version === 'mixed') {
    // V4 only actions

    // Timers
    actions.start_countdown_v4 = {
      label: 'Start a countdown timer V4',
      options: timerTimeOptions,
    };

    actions.target_countdown_v4 = {
      label: 'Start a countdown to a time V4',
      options: [
        timerOption,
        {
          type: 'textinput',
          label: 'Target time (HH:MM:SS)',
          id: 'target',
        },
      ],
    };

    actions.start_countup_v4 = {
      label: 'Start a count up timer V4',
      options: timerTimeOptions,
    };

    actions.target_countup_v4 = {
      label: 'Start counting up from a time V4',
      options: [
        timerOption,
        {
          type: 'textinput',
          label: 'Target time (HH:MM:SS)',
          id: 'target',
        },
      ],
    };

    actions.timer_modify_v4 = {
      label: 'Modify a running timer V4',
      options: timerTimeOptions,
    };

    actions.timer_pause_v4 = {
      label: 'Pause a running timer V4',
      options: [
        timerOption,
      ],
    };

    actions.timer_resume_v4 = {
      label: 'Resume a paused timer V4',
      options: [
        timerOption,
      ],
    };

    actions.timer_stop_v4 = {
      label: 'Stop a running timer V4',
      options: [
          timerOption,
      ],
    };

    // Source commands
    actions.source_hide_v4 = {
      label: 'Hide a time source V4',
      options: [
        sourceOption,
      ],
    };

    actions.source_show_v4 = {
      label: 'Show a time source V4',
      options: [
        sourceOption,
      ],
    };

    actions.source_title_v4 = {
      label: 'Set source title V4',
      options: [
        sourceOption,
        {
          type: 'textinput',
          label: 'Title',
          id: 'title',
        },
      ],
    };

    actions.source_colors_v4 = {
      label: 'Set source colors V4',
      options: [
        sourceOption,
        {
          type: 'textinput',
          label: 'Red',
          id: 'red',
          default: 255,
          regex: this.REGEX_UNSIGNED_INTEGER,
        },
        {
          type: 'textinput',
          label: 'Green',
          id: 'green',
          default: 0,
          regex: this.REGEX_UNSIGNED_INTEGER,
        },
        {
          type: 'textinput',
          label: 'Blue',
          id: 'blue',
          default: 0,
          regex: this.REGEX_UNSIGNED_INTEGER,
        },
        {
          type: 'textinput',
          label: 'Alpha',
          id: 'alpha',
          default: 255,
          regex: this.REGEX_UNSIGNED_INTEGER,
        },
        {
          type: 'textinput',
          label: 'BG Red',
          id: 'bg_red',
          default: 0,
          regex: this.REGEX_UNSIGNED_INTEGER,
        },
        {
          type: 'textinput',
          label: 'BG Green',
          id: 'bg_green',
          default: 0,
          regex: this.REGEX_UNSIGNED_INTEGER,
        },
        {
          type: 'textinput',
          label: 'BG Blue',
          id: 'bg_blue',
          default: 0,
          regex: this.REGEX_UNSIGNED_INTEGER,
        },
        {
          type: 'textinput',
          label: 'BG Alpha',
          id: 'bg_alpha',
          default: 64,
          regex: this.REGEX_UNSIGNED_INTEGER,
        },
      ],
    };

    actions.title_colors_v4 = {
      label: 'Set source title colors V4',
      options: [
        {
          type: 'textinput',
          label: 'Red',
          id: 'red',
          default: 255,
          regex: this.REGEX_UNSIGNED_INTEGER,
        },
        {
          type: 'textinput',
          label: 'Green',
          id: 'green',
          default: 0,
          regex: this.REGEX_UNSIGNED_INTEGER,
        },
        {
          type: 'textinput',
          label: 'Blue',
          id: 'blue',
          default: 0,
          regex: this.REGEX_UNSIGNED_INTEGER,
        },
        {
          type: 'textinput',
          label: 'Alpha',
          id: 'alpha',
          default: 255,
          regex: this.REGEX_UNSIGNED_INTEGER,
        },
        {
          type: 'textinput',
          label: 'BG Red',
          id: 'bg_red',
          default: 0,
          regex: this.REGEX_UNSIGNED_INTEGER,
        },
        {
          type: 'textinput',
          label: 'BG Green',
          id: 'bg_green',
          default: 0,
          regex: this.REGEX_UNSIGNED_INTEGER,
        },
        {
          type: 'textinput',
          label: 'BG Blue',
          id: 'bg_blue',
          default: 0,
          regex: this.REGEX_UNSIGNED_INTEGER,
        },
        {
          type: 'textinput',
          label: 'BG Alpha',
          id: 'bg_alpha',
          default: 255,
          regex: this.REGEX_UNSIGNED_INTEGER,
        },
      ],
    };

    actions.hide_sources_v4 = {
      label: 'Hide all sources V4',
      options: [],
    };

    actions.show_sources_v4 = {
      label: 'Show all sources V4',
      options: [],
    };

    // Misc commands
    actions.info_v4 = {
      label: 'Show clock info overlay V4',
      options: [
        {
          type: 'textinput',
          label: 'Duration (seconds)',
          id: 'duration',
          width: 5,
          default: 30,
          regex: this.REGEX_UNSIGNED_INTEGER,
        },
      ],
    };

    actions.background_v4 = {
      label: 'Change background V4',
      options: [
        {
          type: 'textinput',
          label: 'Background number',
          id: 'bg',
          default: 1,
          regex: this.REGEX_UNSIGNED_NUMBER,
        },
      ],
    };

    actions.send_text_v4 = {
      label: 'Send text V4',
      options: [
        {
          type: 'textinput',
          label: 'Text (clocks running on raspberries can display 17 characters, too long messages will be replaced with INVALID TEXT)',
          id: 'text',
          width: 30,
          default: 'stop',
        },
        {
          type: 'textinput',
          label: 'Duration (seconds)',
          id: 'duration',
          default: 60,
          regex: this.REGEX_UNSIGNED_INTEGER,
        },
        {
          type: 'textinput',
          label: 'Red',
          id: 'red',
          default: 255,
          regex: this.REGEX_UNSIGNED_INTEGER,
        },
        {
          type: 'textinput',
          label: 'Green',
          id: 'green',
          default: 0,
          regex: this.REGEX_UNSIGNED_INTEGER,
        },
        {
          type: 'textinput',
          label: 'Blue',
          id: 'blue',
          default: 0,
          regex: this.REGEX_UNSIGNED_INTEGER,
        },
        {
          type: 'textinput',
          label: 'Alpha',
          id: 'alpha',
          default: 255,
          regex: this.REGEX_UNSIGNED_INTEGER,
        },
        {
          type: 'textinput',
          label: 'BG Red',
          id: 'bg_red',
          default: 0,
          regex: this.REGEX_UNSIGNED_INTEGER,
        },
        {
          type: 'textinput',
          label: 'BG Green',
          id: 'bg_green',
          default: 0,
          regex: this.REGEX_UNSIGNED_INTEGER,
        },
        {
          type: 'textinput',
          label: 'BG Blue',
          id: 'bg_blue',
          default: 0,
          regex: this.REGEX_UNSIGNED_INTEGER,
        },
        {
          type: 'textinput',
          label: 'BG Alpha',
          id: 'bg_alpha',
          default: 64,
          regex: this.REGEX_UNSIGNED_INTEGER,
        },
      ],
    };
  }

  if (this.config.version === '3' || this.config.version === 'mixed') {
    // V3 only actions
    actions.normal_mode = {
      label: 'Display current time',
      options: [
      ],
    };
    actions.kill_display = {
      label: 'Display off',
      options: [
      ],
    };
    actions.start_countup = {
      label: 'Start counting up',
      options: [
      ],
    };
    actions.pause_countdown = {
      label: 'Pause countdown(s)',
      options: [
      ],
    };
    actions.resume_countdown = {
      label: 'Resume countdown(s)',
      options: [
      ],
    };
    actions.modify_countdown = {
      label: 'Primary countdown: modify',
      options: [
        {
          type: 'textinput',
          label: 'Timer (seconds)',
          id: 'secs',
          default: 0,
          regex: this.REGEX_SIGNED_NUMBER,
        },
        {
          type: 'textinput',
          label: 'Timer (minutes)',
          id: 'mins',
          default: 1,
          regex: this.REGEX_SIGNED_NUMBER,
        },
        {
          type: 'textinput',
          label: 'Timer (hours)',
          id: 'hours',
          default: 0,
          regex: this.REGEX_SIGNED_NUMBER,
        },
      ],
    };
    actions.stop_countdown = {
      label: 'Primary countdown: stop',
      options: [
      ],
    };
    actions.start_countdown2 = {
      label: 'Secondary countdown: start',
      options: [
        {
          type: 'textinput',
          label: 'Timer (seconds)',
          id: 'secs',
          default: 0,
          regex: this.REGEX_UNSIGNED_NUMBER,
        },
        {
          type: 'textinput',
          label: 'Timer (minutes)',
          id: 'mins',
          default: 1,
          regex: this.REGEX_UNSIGNED_NUMBER,
        },
        {
          type: 'textinput',
          label: 'Timer (hours)',
          id: 'hours',
          default: 0,
          regex: this.REGEX_UNSIGNED_NUMBER,
        },
      ],
    };
    actions.modify_countdown2 = {
      label: 'Secondary countdown: modify',
      options: [
        {
          type: 'textinput',
          label: 'Timer (seconds)',
          id: 'secs',
          default: 0,
          regex: this.REGEX_SIGNED_NUMBER,
        },
        {
          type: 'textinput',
          label: 'Timer (minutes)',
          id: 'mins',
          default: 1,
          regex: this.REGEX_SIGNED_NUMBER,
        },
        {
          type: 'textinput',
          label: 'Timer (hours)',
          id: 'hours',
          default: 0,
          regex: this.REGEX_SIGNED_NUMBER,
        },
      ],
    };
    actions.stop_countdown2 = {
      label: 'Secondary countdown: stop',
      options: [
      ],
    };
    actions.send_text = {
      label: 'Send text',
      options: [
        {
          type: 'textinput',
          label: 'Text',
          id: 'text',
          width: 4,
          default: 'stop',
        },
        {
          type: 'textinput',
          label: 'Red',
          id: 'red',
          default: 255,
          regex: this.REGEX_UNSIGNED_FLOAT,
        },
        {
          type: 'textinput',
          label: 'Green',
          id: 'green',
          default: 0,
          regex: this.REGEX_UNSIGNED_FLOAT,
        },
        {
          type: 'textinput',
          label: 'Blue',
          id: 'blue',
          default: 0,
          regex: this.REGEX_UNSIGNED_FLOAT,
        },
      ],
    };
  }

  // Common actions
  actions.pause_timers = {
    label: 'Pause all timers',
  };

  actions.resume_timers = {
    label: 'Resume all timers',
  };

  actions.sync_time = {
    label: 'Sync clock time with the companion computer',
    options: [
    ],
  };

  actions.seconds_off = {
    label: 'Hide seconds number',
    options: [
    ],
  };
  actions.seconds_on = {
    label: 'Show seconds number',
    options: [
    ],
  };

  return actions;
};

exports.doAction = function doAction(action) {
  let addr;
  let payload;
  let secs;
  addr = '';
  payload = [];

  function parseTime(h, m, s) {
    let hours;
    let mins;

    hours = parseInt(h, 10);
    if (hours.isNaN) {
      hours = 0;
    }

    mins = parseInt(m, 10);
    if (mins.isNaN) {
      mins = 0;
    }
    mins += hours * 60;

    secs = parseInt(s, 10);
    if (secs.isNaN) {
      secs = 0;
    }
    secs += mins * 60;
    return secs;
  }

  if (action.options.hours) {
    secs = parseTime(action.options.hours, action.options.mins, action.options.secs);
  }

  // V4 timer commands
  if (action.action === 'start_countdown_v4') {
    addr = `/clock/timer/${action.options.timer}/countdown`;
    payload = [{
      type: 'i',
      value: secs,
    }];
  }

  if (action.action === 'target_countdown_v4') {
    addr = `/clock/timer/${action.options.timer}/countdown/target`;
    payload = [{
     type: 's',
     value: action.options.target,
    }];
  }

  if (action.action === 'start_countup_v4') {
    addr = `/clock/timer/${action.options.timer}/countup`;
  }

  if (action.action === 'target_countup_v4') {
    addr = `/clock/timer/${action.options.timer}/countup/target`;
    payload = [{
     type: 's',
     value: action.options.target,
    }];
  }

  if (action.action === 'timer_modify_v4') {
    addr = `/clock/timer/${action.options.timer}/modify`;
    payload = [{
      type: 'i',
      value: secs,
    }];
  }

  if (action.action === 'timer_pause_v4') {
    addr = `/clock/timer/${action.options.timer}/pause`;
  }

  if (action.action === 'timer_resume_v4') {
    addr = `/clock/timer/${action.options.timer}/resume`;
  }

  if (action.action === 'timer_stop_v4') {
    addr = `/clock/timer/${action.options.timer}/stop`;
  }

  if (action.action === 'pause_timers') {
    addr = '/clock/pause';
  }

  if (action.action === 'resume_timers') {
    addr = '/clock/resume';
  }

  // V4 Source commands
  if (action.action === 'source_hide_v4') {
    addr = `/clock/source/${action.options.source}/hide`;
  }

  if (action.action === 'source_show_v4') {
    addr = `/clock/source/${action.options.source}/show`;
  }

  if (action.action === 'source_title_v4') {
    addr = `/clock/source/${action.options.source}/title`;
    payload = [{
      type: 's',
      value: action.options.title,
    },
    ];
  }

  if (action.action === 'source_colors_v4') {
    const red = {
      type: 'i',
      value: action.options.red,
    };
    const green = {
      type: 'i',
      value: action.options.green,
    };
    const blue = {
      type: 'i',
      value: action.options.blue,
    };
    const alpha = {
      type: 'i',
      value: action.options.alpha,
    };
    const bgRed = {
      type: 'i',
      value: action.options.bg_red,
    };
    const bgGreen = {
      type: 'i',
      value: action.options.bg_green,
    };
    const bgBlue = {
      type: 'i',
      value: action.options.bg_blue,
    };
    const bgAlpha = {
      type: 'i',
      value: action.options.bg_alpha,
    };

    addr = `/clock/source/${action.options.source}/colors`;
    payload = [
      red, green, blue, alpha,
      bgRed, bgGreen, bgBlue, bgAlpha,
    ];
  }

   if (action.action === 'title_colors_v4') {
    const red = {
      type: 'i',
      value: action.options.red,
    };
    const green = {
      type: 'i',
      value: action.options.green,
    };
    const blue = {
      type: 'i',
      value: action.options.blue,
    };
    const alpha = {
      type: 'i',
      value: action.options.alpha,
    };
    const bgRed = {
      type: 'i',
      value: action.options.bg_red,
    };
    const bgGreen = {
      type: 'i',
      value: action.options.bg_green,
    };
    const bgBlue = {
      type: 'i',
      value: action.options.bg_blue,
    };
    const bgAlpha = {
      type: 'i',
      value: action.options.bg_alpha,
    };

    addr = '/clock/titlecolors';
    payload = [
      red, green, blue, alpha,
      bgRed, bgGreen, bgBlue, bgAlpha,
    ];
  }

  if (action.action === 'hide_sources_v4') {
    addr = '/clock/hide';
  }

  if (action.action === 'show_sources_v4') {
    addr = '/clock/show';
  }

  // Misc commands
  if (action.action === 'info_v4') {
    addr = '/clock/info';
    payload = [{
      type: 'i',
      value: action.options.duration
    }];
  }

  if (action.action === 'background_v4') {
    addr = '/clock/background';
    payload = [{
      type: 'i',
      value: action.options.bg,
    },
    ];
  }

  if (action.action === 'send_text_v4') {
    const red = {
      type: 'i',
      value: action.options.red,
    };
    const green = {
      type: 'i',
      value: action.options.green,
    };
    const blue = {
      type: 'i',
      value: action.options.blue,
    };
    const alpha = {
      type: 'i',
      value: action.options.alpha,
    };
    const bgRed = {
      type: 'i',
      value: action.options.bg_red,
    };
    const bgGreen = {
      type: 'i',
      value: action.options.bg_green,
    };
    const bgBlue = {
      type: 'i',
      value: action.options.bg_blue,
    };
    const bgAlpha = {
      type: 'i',
      value: action.options.bg_alpha,
    };
    const duration = {
      type: 'i',
      value: action.options.duration,
    };
    const text = {
      type: 's',
      value: `${action.options.text}`,
    };

    addr = '/clock/text';
    payload = [
      red, green, blue, alpha,
      bgRed, bgGreen, bgBlue, bgAlpha,
      duration, text,
    ];
  }

  if (action.action === 'sync_time') {
    const today = new Date();
    const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    addr = '/clock/time/set';
    payload = [{ type: 's', value: time }];
  }


  // Legacy V3 commands
  if (action.action === 'kill_display') {
    addr = '/clock/kill';
  }

  if (action.action === 'normal_mode') {
    addr = '/clock/normal';
  }

  if (action.action === 'seconds_off') {
    addr = '/clock/seconds/off';
  }

  if (action.action === 'seconds_on') {
    addr = '/clock/seconds/on';
  }

  if (action.action === 'start_countup') {
    addr = '/clock/countup/start';
  }

  if (action.action === 'pause_countdown') {
    addr = '/clock/pause';
  }

  if (action.action === 'resume_countdown') {
    addr = '/clock/resume';
  }

  if (action.action === 'start_countdown') {
    addr = '/clock/countdown/start';
    payload = [{
      type: 'i',
      value: secs,
    },
    ];
  }

  if (action.action === 'start_countdown2') {
    addr = '/clock/countdown2/start';
    payload = [{
      type: 'i',
      value: secs,
    },
    ];
  }

  if (action.action === 'modify_countdown') {
    addr = '/clock/countdown/modify';
    payload = [{
      type: 'i',
      value: secs,
    },
    ];
  }

  if (action.action === 'modify_countdown2') {
    addr = '/clock/countdown2/modify';
    payload = [{
      type: 'i',
      value: secs,
    },
    ];
  }

  if (action.action === 'stop_countdown') {
    addr = '/clock/countdown/stop';
  }

  if (action.action === 'stop_countdown2') {
    addr = '/clock/countdown2/stop';
  }

  if (action.action === 'send_text') {
    const red = {
      type: 'f',
      value: parseFloat(action.options.red),
    };
    const green = {
      type: 'f',
      value: parseFloat(action.options.green),
    };
    const blue = {
      type: 'f',
      value: parseFloat(action.options.blue),
    };
    const text = {
      type: 's',
      value: `${action.options.text}`,
    };
    addr = '/clock/display';
    payload = [red, green, blue, text];
  }

  // Send the message
  if (addr !== '') {
    this.system.emit('osc_send', this.config.host, this.config.port, addr, payload);
  }
};
