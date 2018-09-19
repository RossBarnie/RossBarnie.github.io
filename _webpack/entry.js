import React from 'react';
import ReactDOM from 'react-dom';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.props = {
      term: null
    };
  }

  render() {
    return (
      <div className="search-bar">
        <label htmlFor="search-text">Search</label>
        <input type="text" name="search-text">{this.props.term}</input>
      </div>
    )
  }
}

const mountNode = document.getElementById("search")
ReactDOM.render(<SearchBar />, mountNode)
