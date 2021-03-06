import React, { Component } from "react";
import { connect } from "react-redux";
import PhotoCard from "./photoCard";
import { fetchPublicUserPhotos } from "../redux/actions/publicProfileAction";
import { emptyImages } from "../redux/actions/searchPhotosAction";
class publicUserPhotos extends Component {
  state = {
    page_no: 1,
    publicUser: this.props.match.params.username,
  };
  handleScroll = () => {
    const windowHeight =
      "innerHeight" in window
        ? window.innerHeight
        : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight) {
      console.log("bottom reached");
      this.setState({ ...this.state, page_no: this.state.page_no + 1 });
    } else {
      console.log("bottom not reached");
    }
  };

  componentDidMount() {
    this.props.emptyImages();
    this.props.fetchPublicUserPhotos(
      this.props.match.params.username,
      this.state.page_no
    );
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }
  componentDidUpdate(prevProps, prevState) {
    console.log(prevProps.match.params.username);
    console.log(this.props.match.params.username);
    if (prevProps.match.params.username !== this.props.match.params.username) {
      this.props.emptyImages();
      this.props.fetchPublicUserPhotos(
        this.props.match.params.username,
        this.state.page_no
      );
    } else {
      console.log("not updating");
    }
    if (prevState.page_no < this.state.page_no) {
      this.props.fetchPublicUserPhotos(
        this.props.match.params.username,
        this.state.page_no
      );
    } else {
      console.log("not updating");
    }
  }
  render() {
    const { photos } = this.props;
    return !photos ? null : (
      <div className="photo-container">
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    photos: state.publicUserState.photos,
  };
};

export default connect(mapStateToProps, { fetchPublicUserPhotos, emptyImages })(
  publicUserPhotos
);
