import { initHeader, clearUrl } from './components/header/header.js';
import { initOptions, showOptions, hideOptions } from './components/options/options.js';
import { initDownloads } from './components/downloads/downloads.js';

initHeader({ onInfo: showOptions, onError: hideOptions });
initOptions({ onStarted: clearUrl });
initDownloads();