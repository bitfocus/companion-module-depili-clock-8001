exports.getPresets = function getPresets() {
  const presets = [];
  let i;

  const white = this.rgb(255, 255, 255);
  const black = this.rgb(0, 0, 0);
  const timerColors = [
    black,
    this.rgb(102, 51, 0),
    this.rgb(255, 0, 0),
    this.rgb(255, 102, 0),
    this.rgb(255, 255, 0),
    this.rgb(0, 255, 0),
    this.rgb(0, 0, 255),
    this.rgb(255, 0, 255),
    this.rgb(120, 120, 120),
    white,
  ];
  const timerTextColors = [
    white,
    white,
    white,
    white,
    black,
    black,
    white,
    white,
    white,
    black,
  ];
  const sourceColors = [
    this.rgb(15, 82, 141),
    this.rgb(61, 130, 191),
    this.rgb(70, 107, 128),
    this.rgb(138, 153, 163),
  ];

  if (this.config.version === '4' || this.config.version === 'mixed') {
    for (i = 0; i < timerColors.length; i++) {
      presets.push({
        category: `Timer ${i}`,
        label: 'Icon',
        bank: {
          style: 'text',
          text: `$(label:timer_${i}_icon)`,
          size: 'auto',
          color: timerTextColors[i],
          bgcolor: timerColors[i],
        },
        actions: [],
        feedbacks: [],
      });

      presets.push({
        category: `Timer ${i}`,
        label: 'Hours',
        bank: {
          style: 'text',
          text: `$(label:timer_${i}_hours)`,
          size: 'auto',
          color: timerTextColors[i],
          bgcolor: timerColors[i],
        },
        actions: [],
        feedbacks: [],
      });

      presets.push({
        category: `Timer ${i}`,
        label: 'Minutes',
        bank: {
          style: 'text',
          text: `$(label:timer_${i}_minutes)`,
          size: 'auto',
          color: timerTextColors[i],
          bgcolor: timerColors[i],
        },
        actions: [],
        feedbacks: [],
      });

      presets.push({
        category: `Timer ${i}`,
        label: 'Seconds',
        bank: {
          style: 'text',
          text: `$(label:timer_${i}_seconds)`,
          size: 'auto',
          color: timerTextColors[i],
          bgcolor: timerColors[i],
        },
        actions: [],
        feedbacks: [],
      });

      presets.push({
        category: `Timer ${i}`,
        label: 'Set 5 min countdown',
        bank: {
          style: 'text',
          text: 'Start\\n5 min',
          size: '18',
          color: timerTextColors[i],
          bgcolor: timerColors[i],
        },
        actions: [
          {
            action: 'start_countdown_v4',
            options: {
              timer: `${i}`,
              secs: '0',
              mins: '5',
              hours: '0',
            },
          },
        ],
      });

      presets.push({
        category: `Timer ${i}`,
        label: 'Set 10 min countdown',
        bank: {
          style: 'text',
          text: 'Start\\n10 min',
          size: '18',
          color: timerTextColors[i],
          bgcolor: timerColors[i],
        },
        actions: [
          {
            action: 'start_countdown_v4',
            options: {
              timer: `${i}`,
              secs: '0',
              mins: '10',
              hours: '0',
            },
          },
        ],
      });

      presets.push({
        category: `Timer ${i}`,
        label: 'Set 30 min countdown',
        bank: {
          style: 'text',
          text: 'Start\\n30 min',
          size: '18',
          color: timerTextColors[i],
          bgcolor: timerColors[i],
        },
        actions: [
          {
            action: 'start_countdown_v4',
            options: {
              timer: `${i}`,
              secs: '0',
              mins: '30',
              hours: '0',
            },
          },
        ],
      });

      presets.push({
        category: `Timer ${i}`,
        label: 'Start count up',
        bank: {
          style: 'text',
          text: 'Start\\ncount',
          size: '18',
          color: timerTextColors[i],
          bgcolor: timerColors[i],
        },
        actions: [
          {
            action: 'start_countup_v4',
            options: {
              timer: `${i}`,
            },
          },
        ],
      });

      presets.push({
        category: `Timer ${i}`,
        label: 'Pause timer',
        bank: {
          style: 'text',
          text: 'Pause',
          size: '18',
          color: timerTextColors[i],
          bgcolor: timerColors[i],
        },
        actions: [
          {
            action: 'timer_pause_v4',
            options: {
              timer: `${i}`,
            },
          },
        ],
      });

      presets.push({
        category: `Timer ${i}`,
        label: 'Resume timer',
        bank: {
          style: 'text',
          text: 'Resume',
          size: '18',
          color: timerTextColors[i],
          bgcolor: timerColors[i],
        },
        actions: [
          {
            action: 'timer_resume_v4',
            options: {
              timer: `${i}`,
            },
          },
        ],
      });

      presets.push({
        category: `Timer ${i}`,
        label: 'Stop timer',
        bank: {
          style: 'text',
          text: 'Stop',
          size: '18',
          color: timerTextColors[i],
          bgcolor: timerColors[i],
        },
        actions: [
          {
            action: 'timer_stop_v4',
            options: {
              timer: `${i}`,
            },
          },
        ],
      });

      presets.push({
        category: `Timer ${i}`,
        label: 'Add 1 minute',
        bank: {
          style: 'text',
          text: '+1\\nmin',
          size: '18',
          color: timerTextColors[i],
          bgcolor: timerColors[i],
        },
        actions: [
          {
            action: 'timer_modify_v4',
            options: {
              timer: `${i}`,
              secs: '0',
              mins: '1',
              hours: '0',
            },
          },
        ],
      });

      presets.push({
        category: `Timer ${i}`,
        label: 'Remove 1 minute',
        bank: {
          style: 'text',
          text: '-1\\nmin',
          size: '18',
          color: timerTextColors[i],
          bgcolor: timerColors[i],
        },
        actions: [
          {
            action: 'timer_modify_v4',
            options: {
              timer: `${i}`,
              secs: '0',
              mins: '-1',
              hours: '0',
            },
          },
        ],
      });

      presets.push({
        category: `Timer ${i}`,
        label: 'Add 2 seconds',
        bank: {
          style: 'text',
          text: '+2\\nsec',
          size: '18',
          color: timerTextColors[i],
          bgcolor: timerColors[i],
        },
        actions: [
          {
            action: 'timer_modify_v4',
            options: {
              timer: `${i}`,
              secs: '2',
              mins: '0',
              hours: '0',
            },
          },
        ],
      });

      presets.push({
        category: `Timer ${i}`,
        label: 'Remove 2 seconds',
        bank: {
          style: 'text',
          text: '-2\\nsec',
          size: '18',
          color: timerTextColors[i],
          bgcolor: timerColors[i],
        },
        actions: [
          {
            action: 'timer_modify_v4',
            options: {
              timer: `${i}`,
              secs: '-2',
              mins: '0',
              hours: '0',
            },
          },
        ],
      });

      presets.push({
        category: `Timer ${i}`,
        label: 'Countdown to target',
        bank: {
          style: 'text',
          text: 'To\\ntime',
          size: '18',
          color: timerTextColors[i],
          bgcolor: timerColors[i],
        },
        actions: [
          {
            action: 'target_countdown_v4',
            options: {
              timer: `${i}`,
              target: '12:00:00',
            },
          },
        ],
      });

      presets.push({
        category: `Timer ${i}`,
        label: 'Count from target',
        bank: {
          style: 'text',
          text: 'From\\ntime',
          size: '18',
          color: timerTextColors[i],
          bgcolor: timerColors[i],
        },
        actions: [
          {
            action: 'target_countup_v4',
            options: {
              timer: `${i}`,
              target: '12:00:00',
            },
          },
        ],
      });
    }
    // End of timer preset loop

    for (i = 1; i < 4; i++) {
      presets.push({
        category: `Source ${i}`,
        label: 'Icon',
        bank: {
          style: 'text',
          text: `$(label:source_${i}_icon)`,
          size: 'auto',
          color: white,
          bgcolor: sourceColors[i - 1],
        },
        actions: [],
        feedbacks: [],
      });

      presets.push({
        category: `Source ${i}`,
        label: 'Hours',
        bank: {
          style: 'text',
          text: `$(label:source_${i}_hours)`,
          size: 'auto',
          color: white,
          bgcolor: sourceColors[i - 1],
        },
        actions: [],
        feedbacks: [],
      });

      presets.push({
        category: `Source ${i}`,
        label: 'Minutes',
        bank: {
          style: 'text',
          text: `$(label:source_${i}_minutes)`,
          size: 'auto',
          color: white,
          bgcolor: sourceColors[i - 1],
        },
        actions: [],
        feedbacks: [],
      });

      presets.push({
        category: `Source ${i}`,
        label: 'Seconds',
        bank: {
          style: 'text',
          text: `$(label:source_${i}_seconds)`,
          size: 'auto',
          color: white,
          bgcolor: sourceColors[i - 1],
        },
        actions: [],
        feedbacks: [],
      });

      presets.push({
        category: `Source ${i}`,
        label: `Hide source ${i}`,
        bank: {
          style: 'text',
          text: `Hide\\nSRC ${i}`,
          size: '18',
          color: white,
          bgcolor: sourceColors[i - 1],
        },
        actions: [
          {
            action: 'source_hide_v4',
            options: {
              source: `${i}`,
            },
          },
        ],
      });
      presets.push({
        category: `Source ${i}`,
        label: `Show source ${i}`,
        bank: {
          style: 'text',
          text: `Show\\nSRC ${i}`,
          size: '18',
          color: white,
          bgcolor: sourceColors[i - 1],
        },
        actions: [
          {
            action: 'source_show_v4',
            options: {
              source: `${i}`,
            },
          },
        ],
      });
    }
    // End of source preset loop

    presets.push({
      category: 'All sources',
      label: 'Hide all sources',
      bank: {
        style: 'text',
        text: 'Hide\\nall',
        size: '18',
        color: black,
        bgcolor: this.rgb(255, 204, 255),
      },
      actions: [
      {
        action: 'hide_sources_v4',
        options: {},
      },
      ],
    });

    presets.push({
      category: 'All sources',
      label: 'Show all sources',
      bank: {
        style: 'text',
        text: 'Show\\nall',
        size: '18',
        color: black,
        bgcolor: this.rgb(255, 204, 255),
      },
      actions: [
      {
        action: 'show_sources_v4',
        options: {},
      },
      ],
    });

    // Misc commands
    presets.push({
      category: 'Misc',
      label: 'Show info overlay',
      bank: {
        style: 'text',
        text: 'Info',
        size: '18',
        color: black,
        bgcolor: this.rgb(153, 255, 204),
      },
      actions: [
      {
        action: 'info_v4',
        options: {
          duration: 30,
        },
      },
      ],
    });

    presets.push({
      category: 'Misc',
      label: 'Pause all timers',
      bank: {
        style: 'text',
        text: 'Pause\\nall',
        size: '18',
        color: black,
        bgcolor: this.rgb(204, 255, 255),
      },
      actions: [
      {
        action: 'pause_timers',
        options: {},
      },
      ],
    });

   presets.push({
      category: 'Misc',
      label: 'Pause all timers',
      bank: {
        style: 'text',
        text: 'Resume\\nall',
        size: '18',
        color: black,
        bgcolor: this.rgb(204, 255, 255),
      },
      actions: [
      {
        action: 'resume_timers',
        options: {},
      },
      ],
    });

   // Text presets
   presets.push({
      category: 'Text',
      label: 'Wrap up',
      bank: {
        style: 'text',
        text: 'Wrap\\nup',
        size: 'auto',
        color: this.rgb(255, 0, 0,),
        bgcolor: black,
      },
      actions: [
      {
        action: 'send_text_v4',
        options: {
          red: 255,
          green: 0,
          blue: 0,
          alpha: 255,
          bg_red: 0,
          bg_green: 0,
          bg_blue: 0,
          bg_alpha: 255,
          duration: 10,
          text: 'Wrap up',
        },
      },
      ],
    });

    presets.push({
      category: 'Text',
      label: 'Please stop',
      bank: {
        style: 'text',
        text: 'Please\\nstop',
        size: 'auto',
        color: this.rgb(255, 0, 0,),
        bgcolor: black,
      },
      actions: [
      {
        action: 'send_text_v4',
        options: {
          red: 255,
          green: 0,
          blue: 0,
          alpha: 255,
          bg_red: 0,
          bg_green: 0,
          bg_blue: 0,
          bg_alpha: 255,
          duration: 10,
          text: 'Please stop',
        },
      },
      ],
    });

    presets.push({
      category: 'Text',
      label: 'Stand by',
      bank: {
        style: 'text',
        text: 'Stand\\nby',
        size: 'auto',
        color: black,
        bgcolor: this.rgb(255, 255, 0),
      },
      actions: [
      {
        action: 'send_text_v4',
        options: {
          red: 0,
          green: 0,
          blue: 0,
          alpha: 255,
          bg_red: 255,
          bg_green: 255,
          bg_blue: 0,
          bg_alpha: 255,
          duration: 0,
          text: 'Stand by',
        },
      },
      ],
    });

    presets.push({
      category: 'Text',
      label: 'GO',
      bank: {
        style: 'text',
        text: 'GO',
        size: 'auto',
        color: black,
        bgcolor: this.rgb(0, 255, 0),
      },
      actions: [
      {
        action: 'send_text_v4',
        options: {
          red: 0,
          green: 0,
          blue: 0,
          alpha: 255,
          bg_red: 0,
          bg_green: 255,
          bg_blue: 0,
          bg_alpha: 255,
          duration: 0,
          text: 'GO',
        },
      },
      ],
    });

    presets.push({
      category: 'Text',
      label: 'On air',
      bank: {
        style: 'text',
        text: 'On\\nair',
        size: 'auto',
        color: white,
        bgcolor: this.rgb(255, 0, 0),
      },
      actions: [
      {
        action: 'send_text_v4',
        options: {
          red: 255,
          green: 255,
          blue: 255,
          alpha: 255,
          bg_red: 255,
          bg_green: 0,
          bg_blue: 0,
          bg_alpha: 255,
          duration: 0,
          text: 'On air',
        },
      },
      ],
    });

    presets.push({
      category: 'Text',
      label: 'Clear text',
      bank: {
        style: 'text',
        text: 'Clear\\ntext',
        size: 'auto',
        color: white,
        bgcolor: black,
      },
      actions: [
      {
        action: 'send_text_v4',
        options: {
          red: 0,
          green: 0,
          blue: 0,
          alpha: 0,
          bg_red: 0,
          bg_green: 0,
          bg_blue: 0,
          bg_alpha: 0,
          duration: 1,
          text: '',
        },
      },
      ],
    });

    // Backgrounds
    for (i = 1; i < 11; i++) {
      presets.push({
        category: 'Backgrounds',
        label: `Select background ${i}`,
        bank: {
          style: 'text',
          text: `BG ${i}`,
          size: 'auto',
          color: black,
          bgcolor: this.rgb(35, 143, 52),
        },
        actions: [
        {
          action: 'background_v4',
          options: {
            bg: i,
          },
        },
        ],
      });
    }
  }
  // End of V4 presets

  if (this.config.version === '3' || this.config.version === 'mixed') {
    presets.push({
      category: 'Timer control',
      label: 'Set 5 min',
      bank: {
        style: 'text',
        text: 'Start\\n5 min',
        size: '18',
        color: '16777215',
        bgcolor: this.rgb(0, 0, 255),
      },
      actions: [
        {
          action: 'start_countdown',
          options: {
            secs: '0',
            mins: '5',
            hours: '0',
          },
        },
      ],
    });
    presets.push({
      category: 'Timer control',
      label: 'Set 10 min',
      bank: {
        style: 'text',
        text: 'Start\\n10 min',
        size: '18',
        color: '16777215',
        bgcolor: this.rgb(0, 0, 255),
      },
      actions: [
        {
          action: 'start_countdown',
          options: {
            secs: '0',
            mins: '10',
            hours: '0',
          },
        },
      ],
    });
    presets.push({
      category: 'Timer control',
      label: 'Set 30 min',
      bank: {
        style: 'text',
        text: 'Start\\n30 min',
        size: '18',
        color: '16777215',
        bgcolor: this.rgb(0, 0, 255),
      },
      actions: [
        {
          action: 'start_countdown',
          options: {
            secs: '0',
            mins: '30',
            hours: '0',
          },
        },
      ],
    });
    presets.push({
      category: 'Timer control',
      label: 'Stop',
      bank: {
        style: 'text',
        text: 'Stop',
        size: '18',
        color: '16777215',
        bgcolor: this.rgb(0, 0, 255),
      },
      actions: [
        {
          action: 'stop_countdown',
        },
      ],
    });
    presets.push({
      category: 'Timer control',
      label: 'Add 1min',
      bank: {
        style: 'text',
        text: '+1\\nmin',
        size: '18',
        color: '16777215',
        bgcolor: this.rgb(0, 0, 255),
      },
      actions: [
        {
          action: 'modify_countdown',
          options: {
            secs: '0',
            mins: '1',
            hours: '0',
          },
        },
      ],
    });
    presets.push({
      category: 'Timer control',
      label: 'Remove 1min',
      bank: {
        style: 'text',
        text: '-1\\nmin',
        size: '18',
        color: '16777215',
        bgcolor: this.rgb(0, 0, 255),
      },
      actions: [
        {
          action: 'modify_countdown',
          options: {
            secs: '0',
            mins: '-1',
            hours: '0',
          },
        },
      ],
    });
    presets.push({
      category: 'Timer 2 control',
      label: 'Set 5 min',
      bank: {
        style: 'text',
        text: 'Start\\n5 min',
        size: '18',
        color: '16777215',
        bgcolor: this.rgb(0, 204, 255),
      },
      actions: [
        {
          action: 'start_countdown2',
          options: {
            secs: '0',
            mins: '5',
            hours: '0',
          },
        },
      ],
    });
    presets.push({
      category: 'Timer 2 control',
      label: 'Set 10 min',
      bank: {
        style: 'text',
        text: 'Start\\n10 min',
        size: '18',
        color: '16777215',
        bgcolor: this.rgb(0, 204, 255),
      },
      actions: [
        {
          action: 'start_countdown2',
          options: {
            secs: '0',
            mins: '10',
            hours: '0',
          },
        },
      ],
    });
    presets.push({
      category: 'Timer 2 control',
      label: 'Set 30 min',
      bank: {
        style: 'text',
        text: 'Start\\n30 min',
        size: '18',
        color: '16777215',
        bgcolor: this.rgb(0, 204, 255),
      },
      actions: [
        {
          action: 'start_countdown2',
          options: {
            secs: '0',
            mins: '30',
            hours: '0',
          },
        },
      ],
    });
    presets.push({
      category: 'Timer 2 control',
      label: 'Stop',
      bank: {
        style: 'text',
        text: 'Stop',
        size: '18',
        color: '16777215',
        bgcolor: this.rgb(0, 204, 255),
      },
      actions: [
        {
          action: 'stop_countdown2',
        },
      ],
    });
    presets.push({
      category: 'Timer 2 control',
      label: 'Add 1min',
      bank: {
        style: 'text',
        text: '+1\\nmin',
        size: '18',
        color: '16777215',
        bgcolor: this.rgb(0, 204, 255),
      },
      actions: [
        {
          action: 'modify_countdown2',
          options: {
            secs: '0',
            mins: '1',
            hours: '0',
          },
        },
      ],
    });
    presets.push({
      category: 'Timer 2 control',
      label: 'Remove 1min',
      bank: {
        style: 'text',
        text: '-1\\nmin',
        size: '18',
        color: '16777215',
        bgcolor: this.rgb(0, 204, 255),
      },
      actions: [
        {
          action: 'modify_countdown2',
          options: {
            secs: '0',
            mins: '-1',
            hours: '0',
          },
        },
      ],
    });
    presets.push({
      category: 'Mode',
      label: 'Black',
      bank: {
        style: 'text',
        text: 'Black',
        size: '18',
        color: this.rgb(255, 128, 0),
        bgcolor: this.rgb(0, 0, 0),
      },
      actions: [
        {
          action: 'kill_display',
        },
      ],
      feedbacks: [
        {
          type: 'state_color',
          options: {
            normal_fg: this.rgb(255, 128, 0),
            normal_bg: this.rgb(0, 0, 0),
            countdown_fg: this.rgb(255, 128, 0),
            countdown_bg: this.rgb(0, 0, 0),
            countup_fg: this.rgb(255, 128, 0),
            countup_bg: this.rgb(0, 0, 0),
            paused_fg: this.rgb(255, 128, 0),
            paused_bg: this.rgb(0, 0, 0),
            off_fg: this.rgb(255, 255, 255),
            off_bg: this.rgb(0, 0, 255),
          },
        },
      ],
    });
    presets.push({
      category: 'Mode',
      label: 'Time of day',
      bank: {
        style: 'text',
        text: 'Time\\nof day',
        size: '18',
        color: this.rgb(255, 128, 0),
        bgcolor: this.rgb(0, 0, 0),
      },
      actions: [
        {
          action: 'normal_mode',
        },
      ],
      feedbacks: [
        {
          type: 'state_color',
          options: {
            normal_fg: this.rgb(255, 255, 255),
            normal_bg: this.rgb(0, 0, 255),
            paused_fg: this.rgb(255, 128, 0),
            paused_bg: this.rgb(0, 0, 0),
            countdown_fg: this.rgb(255, 128, 0),
            countdown_bg: this.rgb(0, 0, 0),
            countup_fg: this.rgb(255, 128, 0),
            countup_bg: this.rgb(0, 0, 0),
            off_fg: this.rgb(255, 128, 0),
            off_bg: this.rgb(0, 0, 0),
          },
        },
      ],
    });
    presets.push({
      category: 'Mode',
      label: 'Count up',
      bank: {
        style: 'text',
        text: 'Count up',
        size: '18',
        color: this.rgb(255, 128, 0),
        bgcolor: this.rgb(0, 0, 0),
      },
      actions: [
        {
          action: 'start_countup',
        },
      ],
      feedbacks: [
        {
          options: {
            normal_fg: this.rgb(255, 128, 0),
            normal_bg: this.rgb(0, 0, 0),
            paused_fg: this.rgb(255, 128, 0),
            paused_bg: this.rgb(0, 0, 0),
            countdown_fg: this.rgb(255, 128, 0),
            countdown_bg: this.rgb(0, 0, 0),
            countup_bg: this.rgb(0, 0, 255),
            countup_fg: this.rgb(255, 255, 255),
            off_fg: this.rgb(255, 128, 0),
            off_bg: this.rgb(0, 0, 0),
          },
          type: 'state_color',
        },
      ],
    });
    presets.push({
      category: 'Mode',
      label: 'Pause countdown(s)',
      bank: {
        style: 'text',
        text: 'Pause',
        size: '18',
        color: this.rgb(255, 128, 0),
        bgcolor: this.rgb(0, 0, 0),
      },
      actions: [
        {
          action: 'pause_countdown',
        },
      ],
      feedbacks: [
        {
          options: {
            running_fg: this.rgb(255, 128, 0),
            running_bg: this.rgb(0, 0, 0),
            paused_fg: this.rgb(255, 255, 255),
            paused_bg: this.rgb(0, 0, 255),
          },
          type: 'pause_color',
        },
      ],
    });
    presets.push({
      category: 'Mode',
      label: 'Resume countdown(s)',
      bank: {
        style: 'text',
        text: 'Resume',
        size: '18',
        color: this.rgb(255, 128, 0),
        bgcolor: this.rgb(0, 0, 0),
      },
      actions: [
        {
          action: 'resume_countdown',
        },
      ],
      feedbacks: [
        {
          options: {
            paused_fg: this.rgb(255, 128, 0),
            paused_bg: this.rgb(0, 0, 0),
            running_fg: this.rgb(255, 255, 255),
            running_bg: this.rgb(0, 0, 255),
          },
          type: 'pause_color',
        },
      ],
    });
    presets.push({
      category: 'Mode',
      label: 'Hide seconds',
      bank: {
        style: 'text',
        text: 'Hide secs',
        size: '18',
        color: this.rgb(255, 128, 0),
        bgcolor: this.rgb(0, 0, 0),
      },
      actions: [
        {
          action: 'seconds_off',
        },
      ],
    });
    presets.push({
      category: 'Mode',
      label: 'Show seconds',
      bank: {
        style: 'text',
        text: 'Show secs',
        size: '18',
        color: this.rgb(255, 128, 0),
        bgcolor: this.rgb(0, 0, 0),
      },
      actions: [
        {
          action: 'seconds_on',
        },
      ],
    });
    presets.push({
      category: 'Display time',
      label: 'Hours',
      bank: {
        style: 'text',
        text: '$(label:time_h)',
        size: 'auto',
        color: this.rgb(255, 255, 255),
        bgcolor: 6619136,
      },
      actions: [],
      feedbacks: [
        {
          options: {
            normal_fg: this.rgb(255, 255, 255),
            normal_bg: 6619136,
            countup_fg: 16777215,
            countup_bg: 7954688,
            countdown_fg: 16777215,
            countdown_bg: 26112,
            paused_fg: 16777215,
            paused_bg: 7954688,
            off_fg: this.rgb(0, 0, 0),
            off_bg: this.rgb(0, 0, 0),
          },
          type: 'state_color',
        },
      ],
    });
    presets.push({
      category: 'Display time',
      label: 'Minutes',
      bank: {
        style: 'text',
        text: '$(label:time_m)',
        size: 'auto',
        color: this.rgb(255, 255, 255),
        bgcolor: 6619136,
      },
      actions: [],
      feedbacks: [
        {
          options: {
            normal_fg: this.rgb(255, 255, 255),
            normal_bg: 6619136,
            countup_fg: 16777215,
            countup_bg: 7954688,
            countdown_fg: 16777215,
            countdown_bg: 26112,
            paused_fg: 16777215,
            paused_bg: 7954688,
            off_fg: this.rgb(0, 0, 0),
            off_bg: this.rgb(0, 0, 0),
          },
          type: 'state_color',
        },
      ],
    });
    presets.push({
      category: 'Display time',
      label: 'Seconds',
      bank: {
        style: 'text',
        text: '$(label:time_s)',
        size: 'auto',
        color: this.rgb(255, 255, 255),
        bgcolor: 6619136,
      },
      actions: [],
      feedbacks: [
        {
          options: {
            normal_fg: this.rgb(255, 255, 255),
            normal_bg: 6619136,
            countup_fg: 16777215,
            countup_bg: 7954688,
            countdown_fg: 16777215,
            countdown_bg: 26112,
            paused_fg: 16777215,
            paused_bg: 7954688,
            off_fg: this.rgb(0, 0, 0),
            off_bg: this.rgb(0, 0, 0),
          },
          type: 'state_color',
        },
      ],
    });
    presets.push({
      category: 'Display time',
      label: 'Tally',
      bank: {
        style: 'text',
        text: '$(label:tally)',
        size: 'auto',
        color: this.rgb(255, 255, 255),
        bgcolor: 6619136,
      },
      actions: [],
      feedbacks: [
        {
          options: {
            normal_fg: this.rgb(255, 255, 255),
            normal_bg: 6619136,
            countup_fg: 16777215,
            countup_bg: 7954688,
            countdown_fg: 16777215,
            countdown_bg: 26112,
            paused_fg: 16777215,
            paused_bg: 7954688,
            off_fg: this.rgb(0, 0, 0),
            off_bg: this.rgb(0, 0, 0),
          },
          type: 'state_color',
        },
      ],
    });
    presets.push({
      category: 'Display time',
      label: 'Clock mode',
      bank: {
        style: 'text',
        text: '$(label:state)',
        size: 'auto',
        color: this.rgb(255, 255, 255),
        bgcolor: 6619136,
      },
      actions: [],
      feedbacks: [
        {
          options: {
            normal_fg: this.rgb(255, 255, 255),
            normal_bg: 6619136,
            countup_fg: 16777215,
            countup_bg: 7954688,
            countdown_fg: 16777215,
            countdown_bg: 26112,
            paused_fg: 16777215,
            paused_bg: 7954688,
            off_fg: this.rgb(64, 64, 64),
            off_bg: this.rgb(0, 0, 0),
          },
          type: 'state_color',
        },
      ],
    });
    presets.push({
      category: 'Display time',
      label: 'Pause status',
      bank: {
        style: 'text',
        text: '$(label:paused)',
        size: 'auto',
        color: this.rgb(255, 255, 255),
        bgcolor: 6619136,
      },
      actions: [],
      feedbacks: [
        {
          options: {
            running_fg: this.rgb(255, 128, 0),
            running_bg: this.rgb(0, 0, 0),
            paused_fg: this.rgb(255, 255, 255),
            paused_bg: this.rgb(0, 0, 255),
          },
          type: 'pause_color',
        },
      ],
    });
  }
  // End of V3 presets

  // Common presets
  presets.push({
    category: 'Sync',
    label: 'Sync time',
    bank: {
      style: 'text',
      text: 'Sync clock',
      size: 'auto',
      color: white,
      bgcolor: this.rgb(88, 23, 88),
    },
    actions: [
      {
        action: 'sync_time',
      },
    ],
    feedbacks: [],
  });

  return presets;
};
