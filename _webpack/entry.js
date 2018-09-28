import React from 'react';
import ReactDOM from 'react-dom';
import { SearchBar } from './search/searchbar.js';
const mountNode = document.getElementById("search")
ReactDOM.hydrate(<SearchBar suppressHydrationWarning={true} />, mountNode)
