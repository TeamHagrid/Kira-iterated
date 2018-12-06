import React from 'react';
import Login from './../router/Login.jsx'
import Signup from './../router/Signup.jsx'
import { Router, Route, Switch } from 'react-router-dom'
import Home from './../router/Home.jsx'
import history from './../router/history.jsx'
import PhotoUpload from './../router/PhotoUpload.jsx'
import axios from 'axios'

const CLOUDINARY_UPLOAD_PRESET = 'wc1bxbvc';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/wc1bxbvc/image/upload';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      modalImgInfo: {},
      username: "",
      userUuid: "",
      password: "",
      isAuthenticated: false,
      uploadedFileCloudinaryUrl: '',
      uploadedSuccess: false,
      uploadText: "",
      uploadStyleClickNightOut: false,
      uploadStyleClickOutDoor: false,
      uploadStyleClickSpring: false,
      uploadStyleClickSummer: false,
      uploadStyleClickFall: false,
      uploadStyleClickWinter: false,
      topPictureList: {},
      displayPicArr: [],
      displayComments: [],
      showDeleteButton: false,

    }
    this.handleUsername = this.handleUsername.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handlePicSubmit = this.handlePicSubmit.bind(this);
    this.handleLoader = this.handleLoader.bind(this);
    this.handleUploadText = this.handleUploadText.bind(this);
    this.onImageDrop = this.onImageDrop.bind(this);
    this.uploadImageReturnHome = this.uploadImageReturnHome.bind(this);
    this.uploadOnclickStyleNightOut = this.uploadOnclickStyleNightOut.bind(this);
    this.uploadOnclickStyleOutDoor = this.uploadOnclickStyleOutDoor.bind(this);
    this.uploadOnclickStyleSpring = this.uploadOnclickStyleSpring.bind(this);
    this.uploadOnclickStyleSummer = this.uploadOnclickStyleSummer.bind(this);
    this.uploadOnclickStyleFall = this.uploadOnclickStyleFall.bind(this);
    this.uploadOnclickStyleWinter = this.uploadOnclickStyleWinter.bind(this);
    this.handleUrlAndTextSubmit = this.handleUrlAndTextSubmit.bind(this);
    this.getTopPictureUrls = this.getTopPictureUrls.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.ExitModal = this.ExitModal.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.handleSignupSubmit = this.handleSignupSubmit.bind(this);
    this.handleDeletePic = this.handleDeletePic.bind(this);
    // // this.getComments = this.getComments.bind(this);
  }


  ExitModal() {
    console.log(this.state.modalImgInfo)
    this.setState({
      showModal: false,
      showDeleteButton: false,
    });
  }
  handleShowModal(event) {
    let key = event.target.id;
    console.log(this.state.topPictureList[key])
    if (this.state.topPictureList[key].userid === this.state.userUuid) {
        this.setState({
            showDeleteButton: true
        })
    };
    this.setState({
      showModal: true,
      modalImgInfo: this.state.topPictureList[key],
    });
  }
  onImageDrop(images) {
    // uploads is an array that would hold all the post methods for each image to be uploaded, then we'd use axios.all()
    const uploads = images.map(image => {
      // our formdata
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET); // Replace the preset name with your own
      formData.append("api_key", 981579266528747); // Replace API key with your own Cloudinary API key
      formData.append("timestamp", (Date.now() / 1000) | 0);
      // Replace cloudinary upload URL with yours
      return axios.post(
        CLOUDINARY_UPLOAD_URL,
        formData,
        { headers: { "X-Requested-With": "XMLHttpRequest" } })
        .then(response => {
          this.setState({
            uploadedFileCloudinaryUrl: response.data.url,
            uploadedSuccess: true,
          })
          console.log(response.data.url)
        })
    });
    // We would use axios `.all()` method to perform concurrent image upload to cloudinary.
    axios.all(uploads).then(() => {
      // ... do anything after successful upload. You can setState() or save the data
      console.log('Images have all being uploaded')
    });
  }
  handleLoginSubmit(event) {
    event.preventDefault();
    // event.target.reset();
    axios.post("http://localhost:3000/login", {
      username: this.state.username,
      password: this.state.password,
    })
      .then(response => {
        this.setState({
          userUuid: response.data,
          isAuthenticated: true,
        })
        window.setTimeout(() => {
          history.push('/home');
        }, 3400)
      })
      .catch(err => {
        console.log(err)
      })

  }
  handleSignupSubmit(event) {
    event.preventDefault();
    axios.post("http://localhost:3000/signup", {
      username: this.state.username,
      password: this.state.password,
    })
      .then(response => {
        this.setState({
          userUuid: response.data,
          isAuthenticated: true,
        })
        window.setTimeout(() => {
          history.push('/home');
        }, 3400)
      })
      .catch(err => {
        console.log(err)
      })
  }
  handleSignup() {
    history.push('/Signup')
  }
  handlePicSubmit(event) {
    event.presentDefault();
    axios.post("http://localhost:3000/upload-picture", {
      uploadedFileCloudinaryUrl: this.state.uploadedFileCloudinaryUrl,
      uploadText: this.state.uploadText
    })
  }
  handleDeletePic(event) {
    axios.delete('http://localhost:3000/delete', {
      data: {picture_url: this.state.modalImgInfo.picture_url}
    })
      .then((response) => {
          this.getTopPictureUrls();
      })
      this.ExitModal();
  }
  handleUsername(event) {
    console.log(event.target.value)
    this.setState({
      username: event.target.value
    })
  }
  handlePassword(event) {
    this.setState({
      password: event.target.value
    })
  }
  handleUploadText(event) {
    this.setState({
      uploadText: event.target.value
    })
  }
  handleLoader() {
    history.push('/home/upload');
  }
  uploadImageReturnHome() {
    this.setState({
      uploadedFileCloudinaryUrl: '',
      uploadedSuccess: false,
    })
    history.push('/home/');
  }
  uploadOnclickStyleNightOut() {
    this.setState({
      uploadStyleClickNightOut: !this.state.uploadStyleClickNightOut,
    })
  }
  uploadOnclickStyleOutDoor() {
    this.setState({
      uploadStyleClickOutDoor: !this.state.uploadStyleClickOutDoor,
    })
  }
  uploadOnclickStyleSpring() {
    this.setState({
      uploadStyleClickSpring: !this.state.uploadStyleClickSpring,
    })
  }
  uploadOnclickStyleSummer() {
    this.setState({
      uploadStyleClickSummer: !this.state.uploadStyleClickSummer,
    })
  }
  uploadOnclickStyleFall() {
    this.setState({
      uploadStyleClickFall: !this.state.uploadStyleClickFall,
    })
  }
  uploadOnclickStyleWinter() {
    this.setState({
      uploadStyleClickWinter: !this.state.uploadStyleClickWinter,
    })
  }
  handleUrlAndTextSubmit() {
    event.preventDefault();
    axios.post("http://localhost:3000/uploadPicture", {
      userUuid: this.state.userUuid,
      uploadedFileCloudinaryUrl: this.state.uploadedFileCloudinaryUrl,
      uploadText: this.state.uploadText,
      uploadStyleClickNightOut: this.state.uploadStyleClickNightOut,
      uploadStyleClickOutDoor: this.state.uploadStyleClickOutDoor,
      uploadStyleClickSpring: this.state.uploadStyleClickSpring,
      uploadStyleClickSummer: this.state.uploadStyleClickSummer,
      uploadStyleClickFall: this.state.uploadStyleClickFall,
      uploadStyleClickWinter: this.state.uploadStyleClickWinter,
    })
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.log(err)
      })
      history.push('/home/')
  }
  getTopPictureUrls() {
    axios.get("http://localhost:3000/pictures")
      .then(response => {
        let arr = [];
        for (let key in response.data) {
          let img_url_crop = response.data[key].picture_url.replace('upload/', 'upload/w_500,h_500/');
          console.log(img_url_crop);
          arr.push(<div><img id={key} onClick={this.handleShowModal} src={img_url_crop} className="imgDisplay" /></div>)
        }
        this.setState({
          topPictureList: response.data,
          displayPicArr: arr,
        })

      })
      .catch(err => {
        console.log(err)
      })
  }

  // getComments() {
  //   axios.get("http://localhost:3000/comments")
  //     .then(response => {
  //       let arr = []
  //       for (let key in response.data)
  //     })
  // }

  render() {
    return (
      // ROUTES
      <Router history={history}>
        <Switch>
          <Route exact path="/"
            render={(props) =>
              <Login {...props}
                parentState={this.state}
                handleUsername={this.handleUsername}
                handlePassword={this.handlePassword}
                handleLoginSubmit={this.handleLoginSubmit}
                handleSignup={this.handleSignup}
              />
            }
          />
          <Route path="/Signup"
            render={(props) =>
              <Signup {...props}
                parentState={this.state}
                handleUsername={this.handleUsername}
                handlePassword={this.handlePassword}
                handleSignupSubmit={this.handleSignupSubmit}
                handleSignup={this.handleSignup} />
            }
          />
          <Route path="/home"
            render={(props) =>
              <Home {...props}
                parentState={this.state}
                handleLoader={this.handleLoader}
                onImageDrop={this.onImageDrop}
                uploadImageReturnHome={this.uploadImageReturnHome}
                handleUploadText={this.handleUploadText}
                uploadOnclickStyleOutDoor={this.uploadOnclickStyleOutDoor}
                uploadOnclickStyleNightOut={this.uploadOnclickStyleNightOut}
                uploadOnclickStyleSpring={this.uploadOnclickStyleSpring}
                uploadOnclickStyleSummer={this.uploadOnclickStyleSummer}
                uploadOnclickStyleFall={this.uploadOnclickStyleFall}
                uploadOnclickStyleWinter={this.uploadOnclickStyleWinter}
                handleUrlAndTextSubmit={this.handleUrlAndTextSubmit}
                getTopPictureUrls={this.getTopPictureUrls}
                ExitModal={this.ExitModal}
                handleDeletePic={this.handleDeletePic}
              />
            }
          />
        </Switch>
      </Router>
    )
  }
}
export default App;