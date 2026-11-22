export const MODE_LABEL = { both: 'Video + Audio', audio: 'Only Audio', video: 'Only Video' };

export const STATUS_LABEL = {
  queued: 'Queued', downloading: 'Downloading', paused: 'Paused', merging: 'Merging',
  completed: 'Completed', error: 'Error', cancelled: 'Cancelled',
};

export const ACTIONS = {
  queued: ['cancel'], downloading: ['toggle', 'cancel'], paused: ['toggle', 'cancel'],
  merging: [], completed: ['remove'], error: ['toggle', 'remove'], cancelled: ['remove'],
};

export const TOGGLE_LABEL = { downloading: 'Pause', paused: 'Continue', error: 'Try again' };