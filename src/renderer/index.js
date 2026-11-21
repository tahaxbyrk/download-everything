import { initHeader } from './components/header/header.js';
import { initOptions, showOptions, hideOptions } from './components/options/options.js';

initHeader({ onInfo: showOptions, onError: hideOptions });
initOptions();