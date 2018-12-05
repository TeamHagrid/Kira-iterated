import React from 'react';
import history from './history.jsx'
import PhotoUpload from './PhotoUpload.jsx'
import PhotoDisplay from './PhotoDisplay.jsx'
import CommentsDisplay from './CommentsDisplay.jsx'
import Collapsible from 'react-collapsible';
import ReactDOM from 'react-dom';

import { Router, Route, Switch } from 'react-router-dom';

const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
  constructor(props) {
    super(props);
    // Create a div that we'll render the modal into. Because each
    // Modal component has its own element, we can render multiple
    // modal components into the modal container.
    this.el = document.createElement('div');
  }

  componentDidMount() {
    // Append the element into the DOM on mount. We'll render
    // into the modal container element (see the HTML tab).
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    // Remove the element from the DOM when we unmount
    modalRoot.removeChild(this.el);
    
  }

  render() {
    // Use a portal to render the children into the element
    return ReactDOM.createPortal(
      // Any valid React child: JSX, strings, arrays, etc.
      this.props.children,
      // A DOM element
      this.el,
    );
  }
}

class Home extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const popUpImg = {
      width: "500px",
      height: "auto",
    }
    const modal = this.props.parentState.showModal ? (
      <Modal>
        <div className="modal">
          <div className="modal-container">
            <div className="modal-left-container">
              <img src={this.props.parentState.modalImgInfo.picture_url} style={popUpImg} />
            </div>
            <div className="modal-right-container">
              <div className="top-right-container">
                <div onClick={this.props.ExitModal} className='close'><input className="close-button" type="submit" value="X" /></div>
              </div>
              <div className="top-right-inner-container">
                <div className="delete-button-container">
                  {this.props.parentState.showDeleteButton?<div onClick={this.props.handleDeletePic} className='delete'><input className="delete-button" type="submit" value="Delete" /></div>: null}
                </div>
                <div>
                  <img src="http://res.cloudinary.com/dwbr9kbj2/image/upload/w_70,h_70,c_thumb,r_max,g_face/v1543878350/ccbd98n2hjesusaqzwl7.png" />
                </div>
                <div className="modal-text">{this.props.parentState.modalImgInfo.description} </div>
                <div className="likes-container">
                  <div>{this.props.parentState.modalImgInfo.likes} likes </div>
                </div>
              <div className="bottom-half-container">
                <div className="comments-container">
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    ) : null;

    return (
      <Router history={history}>
        <div>
          <div className='header'>
            <div className='photo-loader' onClick={this.props.handleLoader} >
            </div>
          </div>
          <div className="div-shadow">
            <Collapsible easing="ease-out" trigger={<div className='hamburger-click'></div>}>
              <div className='filters-container'>
                <div className="filter-item"> Filter </div>
                <div className="filter-item"> Top </div>
                <div className="filter-item"> Style </div>
              </div>
            </Collapsible>

          </div>
          <Switch>
            <Route exact path="/home" render={(props) =>
              <PhotoDisplay {...props}
                parentState={this.props.parentState}
                getTopPictureUrls={this.props.getTopPictureUrls}
              />
            } />
            <Route exact path="/home/upload" render={(props) =>
              <PhotoUpload {...props}
                parentState={this.props.parentState}
                onImageDrop={this.props.onImageDrop}
                uploadImageReturnHome={this.props.uploadImageReturnHome}
                handleUploadText={this.props.handleUploadText}
                uploadOnclickStyleOutDoor={this.props.uploadOnclickStyleOutDoor}
                uploadOnclickStyleNightOut={this.props.uploadOnclickStyleNightOut}
                uploadOnclickStyleSpring={this.props.uploadOnclickStyleSpring}
                uploadOnclickStyleSummer={this.props.uploadOnclickStyleSummer}
                uploadOnclickStyleFall={this.props.uploadOnclickStyleFall}
                uploadOnclickStyleWinter={this.props.uploadOnclickStyleWinter}
                handleUrlAndTextSubmit={this.props.handleUrlAndTextSubmit}
              />
            } />
          </Switch>
          {modal}
        </div>

      </Router>
    )
  }
}

export default Home;