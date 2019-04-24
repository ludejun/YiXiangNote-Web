import React, { Component } from 'react';
import RichTextEditor from '../../components/RichTextEditor/index';

class Note extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    return (
      <div>
        RichTextEditor
        <RichTextEditor />
      </div>
    );
  }
}

export default Note;
