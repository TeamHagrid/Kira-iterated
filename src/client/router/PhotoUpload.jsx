import React from 'react'
import history from './history.jsx'
import Dropzone from 'react-dropzone';

class PhotoUpload extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const imgStyle = {
      width: '300px',
      height: 'auto',
    }
    const textInput = {
      color: "red",
    }
    return (
      <div>
        <div className="back-btn-container">
          <button className='back-btn' onClick={this.props.uploadImageReturnHome}>X</button>
        </div>
        <div className="upload-container">
          <form>
            <div className="FileUpload">

              <Dropzone
                className="dropZone"
                onDrop={this.props.onImageDrop}
                multiple={false}
                accept="image/*">
                {!this.props.parentState.uploadedSuccess
                  ? <div>Drop an image or click to select a file to upload.</div>
                  : <div>
                    <div>Uploaded.</div>
                    <div className="upload-img-container">
                      <img src={this.props.parentState.uploadedFileCloudinaryUrl} style={imgStyle} />
                    </div>

                  </div>
                }
              </Dropzone>

            </div>
          </form>
          {this.props.parentState.uploadedSuccess
            ? <div className="upload-img-description-container">
              <div className="container-left">
                <div className="upload-img-text-header">
                  <div>Tell us more about the outfit!</div>
                  <div className="upload-style-container">
                    <div className="title">Style: </div>
                    <div className={!this.props.parentState.uploadStyleClickNightOut ? 'style-item' : 'style-item-click'} onClick={this.props.uploadOnclickStyleNightOut} >NightLife</div>
                    <div className={!this.props.parentState.uploadStyleClickOutDoor ? 'style-item' : 'style-item-click'} onClick={this.props.uploadOnclickStyleOutDoor} >Outdoor</div>
                  </div>
                  <div className="upload-seasons-container">
                    <div className="title">Season: </div>
                      <div className={!this.props.parentState.uploadStyleClickSpring ? 'style-item' : 'style-item-click'} onClick={this.props.uploadOnclickStyleSpring} >Spring</div>
                      <div className={!this.props.parentState.uploadStyleClickSummer ? 'style-item' : 'style-item-click'} onClick={this.props.uploadOnclickStyleSummer} >Summer</div>
                      <div className={!this.props.parentState.uploadStyleClickFall ? 'style-item' : 'style-item-click'} onClick={this.props.uploadOnclickStyleFall} >Fall</div>
                      <div className={!this.props.parentState.uploadStyleClickWinter ? 'style-item' : 'style-item-click'} onClick={this.props.uploadOnclickStyleWinter} >Winter</div>
                   </div>
                  <form onSubmit={this.props.handleUrlAndTextSubmit}>
                    <textarea className="upload-img-text-input" type="text" value={this.props.uploadText} onChange={this.props.handleUploadText}>
                    </textarea>
                    <input type="submit" value="Submit" />
                  </form>
                </div>
              </div>
            </div>
            : null
          }
        </div>
      </div>
    )
  }
};


export default PhotoUpload;