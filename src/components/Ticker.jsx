import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';


let CRYPTOCOMPARE_API = "https://streamer.cryptocompare.com/";
let COINMARKET_API = "https://api.coinmarketcap.com/v1/ticker/";
// let coinArr = ['DOGE', 'BTC', 'LTC', 'XRP', 'ETH', 'XLM']


class Ticker extends React.Component {

  constructor() {
    super();
    this.state = {
      "coins": {}
    };
  };

  componentWillMount() {
    this.getAllCoins();
  };

  getAllCoins = () => {
    // Get all available coins from CoinMarketCap API.
    axios.get(COINMARKET_API).then((response) => {
      if (response.status === 200) {

        let coins = {};

        /*
        response.data.filter((coin) => {
          return coinArr.indexOf(coin.symbol) !== -1
        }).map((coin) => {
          coins[coin.symbol] = coin
          return null
        });
        */

        response.data.map((coin) => {
          coins[coin.symbol] = coin
          return null
        });

        this.setState({ "coins": coins });
        this.subscribeCryptoStream();
      };
    });
  };

  subscribeCryptoStream = () => {
    // Subscribe to CryptoCompare websocket API.

    let subs = [];
    let cryptoIO = io.connect(CRYPTOCOMPARE_API);

    Object.keys(this.state.coins).map((key) => {
      return subs.push("5~CCCAGG~" + key + "~USD");
    });

    cryptoIO.emit("SubAdd", { "subs": subs });

    cryptoIO.on("m", (message) => {
      // console.log(message)
      this.updateCoin(message);
    });
  };

  updateCoin = (message) => {
    // Update coin with recent data from CryptoCompare websocket API.

    message = message.split("~");
    let coins = Object.assign({}, this.state.coins);

    if ((message[4] === "1") || (message[4] === "2")) {

      if (message[4] === "1") {
        coins[message[2]].goUp = true;
        coins[message[2]].goDown = false;
      }
      else if (message[4] === "2") {
        coins[message[2]].goUp = false;
        coins[message[2]].goDown = true;
      }
      else {
        coins[message[2]].goUp = false;
        coins[message[2]].goDown = false;
      }

      coins[message[2]].price_usd = message[5];
      this.setState({ "coins": coins });

      /*
        Reset coin status after short interval. This is needed to reset
        css class of tick animation when coin's value goes up or down again.
      */
      setTimeout(() => {
        coins = Object.assign({}, this.state.coins)
        coins[message[2]].goUp = false
        coins[message[2]].goDown = false
        this.setState({ "coins": coins })
      }, 500);

    };
  };

  getTickStyle = (coin) => {
    // Return css style based on coin status.
    if (coin.goUp) {
      return " tickGreen ";
    } else if (coin.goDown) {
      return " tickRed ";
    } else {
      return " ";
    }
  };

  render() {
    return (
      <div>
        <div className="container-fluid">
          <div className="row">
            {Object.keys(this.state.coins).map((key, index) => {

              let coin = this.state.coins[key]

              // let round = (3 / coin.price_usd).toFixed(5) >= 999 ? (3 / coin.price_usd).toFixed(3) : (3 / coin.price_usd).toFixed(5)

              return (
                <div key={index} className="col-12 col-sm-6 col-xl-4 p-0">
                  <div className={"stock " + this.getTickStyle(coin)}>
                    <p className="m-0 symbol"><img className="coffee" alt="" title="" src="./static/icons/coffee.svg"/> = {(3 / coin.price_usd).toFixed(5) >= 999 ? (3 / coin.price_usd).toFixed(3) : (3 / coin.price_usd).toFixed(6)} {coin.symbol}<span className="qCode"></span></p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  };
};


export default Ticker;
