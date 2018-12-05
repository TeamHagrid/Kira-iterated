import React from 'react';


class PhotoDisplay extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    console.log('hihihi did mount');
    this.props.getTopPictureUrls();
  }

  render() {
    return (
      <div>
        <div className="display-outer-container">
          <div className="display-container">
            {this.props.parentState.displayPicArr}
          </div>
        </div>
      </div>
    )
  }
}


export default PhotoDisplay;