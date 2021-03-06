import React from 'react';
import {
  StyleSheet, Text, View, ListView, TouchableOpacity, Image, ActivityIndicator,
  Modal, TouchableHighlight, Switch, WebView
} from 'react-native';

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      isLoading: true,
      modalVisible: false,
      webViewVisible: false,
    }
    this.reRender = this.reRender.bind(this)
    this.rateMovie = this.rateMovie.bind(this)
    this.setModalVisible = this.setModalVisible.bind(this)
    this._linkPressed = this._linkPressed.bind(this)
  }

  componentDidMount() {
    return fetch('https://output.jsbin.com/rahutemese.json')
      .then((response) => response.json())
      .then((responseJson) => {
        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.setState({
          isLoading: false,
          data: responseJson.data,
          dataSource: ds.cloneWithRows(responseJson.data),
        })
        this.addVoteProperty()
      })
      .catch((error) => {
        console.error(error);
      });
  }

  addVoteProperty() {
    let data = this.state.data

    Object.keys(data).forEach(function (key) {

      data[key].popularity = 0

    });
    this.setState({ data: data })
  }

  rateMovie(id, upvote, modal) {
    let data = this.state.data

    Object.keys(data).forEach(function (key) {
      if (key === id) {
        if ((data[key].popularity >= 0 && upvote) || (data[key].popularity > 0 && !upvote))
          upvote ? data[key].popularity++ : data[key].popularity--
      }
    })

    if (modal) {
      if ((this.state.popularity >= 0 && upvote) || (this.state.popularity > 0 && !upvote)) {
        upvote ? this.setState({ popularity: ++this.state.popularity }) : this.setState({ popularity: --this.state.popularity })
      }
    }

    this.reRender(data)

  }
  reRender(data) {
    let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.setState({
      data: data,
      dataSource: ds.cloneWithRows(data)
    })
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  renderRow(movie, sectionId, rowId) {
    return (
      <View style={styles.container}>

        <TouchableOpacity activeOpacity={0.7} onPress={() => { this._sendData(movie, rowId) }}>
          <Image source={{ uri: movie.cover }} style={styles.image} />
        </TouchableOpacity>
        <Text style={styles.title}>{movie.title} ({movie.releaseYear})</Text>

        <View style={{ flexDirection: 'row' }}>

          <TouchableOpacity activeOpacity={0.6} onPress={() => { this.rateMovie(rowId, true) }} style={styles.button}>

            <Image source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Facebook_like_thumb.png/1196px-Facebook_like_thumb.png" }}
              style={styles.button} />
          </TouchableOpacity>

          <TouchableHighlight >
            <Text style={styles.popularity}>{movie.popularity}</Text>
          </TouchableHighlight>

          <TouchableOpacity onPress={() => { this.rateMovie(rowId, false) }}>

            <Image source={{ uri: "https://qph.ec.quoracdn.net/main-qimg-fd1238ccb878077607a087fbeec0ed44" }}
              style={styles.button} />
          </TouchableOpacity>

        </View>

      </View>)
  }
  _sendData(movie, rowId) {
    this.setState({
      title: movie.title,
      year: movie.releaseYear,
      day: movie.releaseDay,
      month: movie.releaseMonth,
      img: movie.cover,
      imdbId: movie.imdbId,
      popularity: movie.popularity,
      rowId: rowId
    })
    this.setModalVisible(true)
  }
  _linkPressed(visible) {
    this.setState({ webViewVisible: visible })
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator size="large" style={styles.activityIndicator} />
        </View>
      );
    }
    return (
      <View style={{ flex: 1, marginTop: Expo.Constants.statusBarHeight }}>
        <MovieDetails
          data={this.state.data}
          setModalVisible={this.setModalVisible}
          modalVisible={this.state.modalVisible}
          rateMovie={this.rateMovie}
          linkPressed={this._linkPressed}
          title={this.state.title}
          year={this.state.year}
          day={this.state.day}
          month={this.state.month}
          img={this.state.img}
          imdbId={this.state.imdbId}
          popularity={this.state.popularity}
          rowId={this.state.rowId} />
        
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
          renderHeader={() => <Header data={this.state.data} dataSource={this.state.dataSource} reRender={this.reRender} />}
        />
        
        <ImdbLink linkPressed={this._linkPressed} imdbId={this.state.imdbId} webViewVisible={this.state.webViewVisible} />
      </View>

    )
  }

}

class MovieDetails extends React.Component {
  render() {
    return (
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={this.props.modalVisible}
        onRequestClose={() => { this.props.setModalVisible(!this.props.modalVisible) }}>

        <View style={{ marginTop: 22 }}>
          <View style={{ alignItems: "center" }}>

            <Image source={{ uri: this.props.img }} style={{ width: 250, height: 350 }} />
            <Text style={{ fontSize: 25, marginTop: 5 }}>{this.props.title}</Text>
            <Text style={{ fontSize: 15 }}>Release date: {this.props.month}/{this.props.day}/{this.props.year}  </Text>

            <View style={{ flexDirection: 'row', marginTop: 10 }}>

              <TouchableOpacity activeOpacity={0.6} onPress={() => { this.props.rateMovie(this.props.rowId, true, true) }} style={styles.button}>

                <Image source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Facebook_like_thumb.png/1196px-Facebook_like_thumb.png" }}
                  style={styles.button} />
              </TouchableOpacity>

              <TouchableHighlight >
                <Text style={styles.popularity}>{this.props.popularity}</Text>
              </TouchableHighlight>

              <TouchableOpacity onPress={() => { this.props.rateMovie(this.props.rowId, false, true) }}>

                <Image source={{ uri: "https://qph.ec.quoracdn.net/main-qimg-fd1238ccb878077607a087fbeec0ed44" }}
                  style={styles.button} />
              </TouchableOpacity>

            </View>

            <TouchableOpacity onPress={() => { this.props.linkPressed(true) }} >
              <Image source={{ uri: "http://ia.media-imdb.com/images/M/MV5BMTk3ODA4Mjc0NF5BMl5BcG5nXkFtZTgwNDc1MzQ2OTE@._V1_.png" }}
                style={{ width: 80, height: 40, marginTop: 10 }} />
            </TouchableOpacity>
            <View style={{ backgroundColor: "#ddd9d9", height: 60, width: 400, marginTop: 40, alignItems: "center" }} >
              <TouchableOpacity activeOpacity={0.3} onPress={() => {
                this.props.setModalVisible(!this.props.modalVisible)
              }}>
                <Image source={{ uri: "http://dkcoin8.com/images/clip-art-x-14.png" }} style={{ width: 25, height: 25, marginTop: 10 }} />
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    )
  }
}

class Header extends React.Component {
  constructor() {
    super()
    this.state = {
      switchValue: false
    }
    this.toggleSwitch = this.toggleSwitch.bind(this)
  }

  toggleSwitch(value) {
    this.setState({ switchValue: value })
    let data = this.props.data
    let newData = []

    if (!this.state.switchValue) {
      Object.keys(data).forEach(function (movie) {
        newData.push(data[movie])
      })

      newData.sort(function (a, b) {
        return b.popularity - a.popularity
      });
      this.props.reRender(newData)
    }
  }
  render() {
    return (<View style={styles.header}>
      <Text style={{ fontSize: 16 }}> Sort by rating: </Text>
      <Switch style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }], marginTop: 15 }} value={this.state.switchValue} onValueChange={this.toggleSwitch} />
    </View>)
  }
}

class ImdbLink extends React.Component {
  render() {
    return (
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={this.props.webViewVisible}
        onRequestClose={() => { this.props.linkPressed(false) }}>
        <WebView
          source={{ uri: 'https://www.imdb.com/title/' + this.props.imdbId }} />

        <View style={{ backgroundColor: "#ddd9d9", height: 60, width: 400, marginTop: 40, alignItems: "center" }} >
          <TouchableOpacity activeOpacity={0.3} onPress={() => { this.props.linkPressed(false) }}>
            <Image source={{ uri: "http://dkcoin8.com/images/clip-art-x-14.png" }} style={{ width: 25, height: 25, marginTop: 20, marginRight: 40 }} />
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: 200,
    height: 250,
    marginBottom: 7,
    marginTop: 20,
  },
  title: {
    fontSize: 15,
    marginBottom: 10
  },
  button: {
    width: 35,
    height: 30,
    marginBottom: 10

  },
  popularity: {
    marginRight: 50,
    marginLeft: 50,
    fontSize: 18
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#d8d8d8',
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80
  },
  header: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#d8d8d8',
    height: 100,
    backgroundColor: "#e8e8e8"
  },
})
