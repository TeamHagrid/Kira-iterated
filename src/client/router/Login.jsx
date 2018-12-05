import React from 'react'
import { Player, BigPlayButton, ControlBar } from 'video-react';
import "../../../node_modules/video-react/dist/video-react.css";
import Dropzone from 'react-dropzone';
import request from 'axios';


class Login extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    console.log(this.props.parentState.isAuthenticated)


    return (
      <div className="login-container">
        <div className="video-div">
          <Player className="video" muted={true} autoPlay={true} startTime="40" >

            {/*  https://vimeo.com/221171310 is the link of the video. the start time for the video is 40 */}
            <source src="https://fpdl.vimeocdn.com/vimeo-prod-skyfire-std-us/01/4234/8/221171310/771038819.mp4?token=1543893975-0xc36e02ce07c6e7e1a43e67569c8b87057f52fede" />
            <BigPlayButton position="center" />
            <ControlBar autoHide={true} disableCompletely={true} />

          </Player>
        </div>

        {!this.props.parentState.isAuthenticated
          ? <div className='form-login'>
            <div className='form-inner'>
              <form onSubmit={this.props.handleLoginSubmit} >
                <div className='user-pass'>
                  <input className="login-text" placeholder="user name" type="text" value={this.props.username} onChange={this.props.handleUsername} />
                  <input className="login-text" placeholder="password" type="password" value={this.props.password} onChange={this.props.handlePassword} />
                </div>
                <div className='sumbit'><input className="login-submit" type="submit" value="Submit" /></div>
              </form>
            </div>
          </div>
          : <div className="success-login">
            <div className="welcome-text">Welcome Back</div>
            <div className="welcome-user">{this.props.parentState.username}</div>
          </div>
        }

      </div>
    )
  }
}


export default Login;