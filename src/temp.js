import { useEffect, useMemo, useState } from "react";
import exchangeIcon from "../assets/icon-exchange.svg";
import { getExchangeRate } from "../services/api";
import { CURRENCY, INIT_WALLETS } from "../utils/constants";
import { formatNumber } from "../utils/helper";
import "./App.less";
import { inputClass } from "./exchange/style";

function App() {
  const [wallets, setWallets] = useState(INIT_WALLETS);
  const [walletFrom, setWalletFrom] = useState();
  const [walletTo, setWalletTo] = useState();
  const [amountFrom, setAmountFrom] = useState(0);
  const [amountTo, setAmountTo] = useState(0);
  const [rate, setRate] = useState(1);


  useEffect(() => {
    if (walletFrom && walletTo) getRate(walletFrom.id, walletTo.id);
  }, [walletFrom, walletTo]);


  const exchange = () => {
    const newWallets = {
      ...wallets,
      [walletFrom.id]: formatNumber(wallets[walletFrom.id] - amountFrom),
      [walletTo.id]: formatNumber(wallets[walletTo.id] + amountTo),
    };
    setWallets(newWallets);
    setAmountFrom(0);
    setAmountTo(0);
  };

 

 
  const errorFrom = useMemo(() => {
    if (!walletFrom) return false;
    const balance = wallets[walletFrom.id];
    if (balance < amountFrom) return "Exceeds balance";
  }, [wallets, amountFrom, walletFrom]);

  const isAvailableExchange = useMemo(() => {
    return (
      amountFrom && amountTo && walletFrom?.id !== walletTo?.id && !errorFrom && !isNaN(parseFloat(rate))
    );
  }, [amountFrom, amountTo, errorFrom, walletFrom, walletTo, rate]);

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-800">
      <div className="space-y-6 text-center">
        <h1 className="text-2xl text-gray-200 font-semibold">
          Currency Exchange
        </h1>
        <div className="bg-white p-6 rounded-lg space-y-6 w-full md:w-96">
          <div className="flex justify-between">
            {CURRENCY.map((cur) => (
              <button
                key={cur.name}
                className={
                  "px-8 py-1 rounded text-white uppercase border border-indigo-500 " +
                  (walletFrom && walletFrom.id === cur.id
                    ? "bg-indigo-500"
                    : "text-indigo-500")
                }
                onClick={() => setWalletFrom(cur)}
              >
                {cur.name}
              </button>
            ))}
          </div>
          {walletFrom ? (
            <div>
              <div className="flex flex-column">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    Balance: {walletFrom.symbol}
                    {wallets[walletFrom.id]}
                  </span>
                  <span className="text-gray-600">
                    -
                    <input
                      type="number"
                      step="0.1"
                      value={amountFrom}
                      onChange={onChangeAmountFrom}
                      className={inputClass +
                        (errorFrom
                          ? "border-gray-500 "
                          : "border-gray-400 focus:border-orange-500 ")
                      }
                    ></input>
                  </span>
                </div>
              </div>
              
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              Select your currency to exchange
            </p>
          )}
        </div>
        <div className="flex justify-center items-center text-white">
          <img className="h-6 w-6 mr-4" src={exchangeIcon} alt="Exchange" />
          {walletFrom && walletTo && (
            <span className="px-5 py-1 border rounded-xl border-white text-sm">
              {walletFrom?.symbol}1 = {walletTo?.symbol}
              {rate}
            </span>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg space-y-6 w-full md:w-96">
          <div className=" flex justify-between">
            {CURRENCY.map((cur) => (
              <button
                key={cur.name}
                className={
                  "px-8 py-1 rounded text-white uppercase border border-indigo-500 " +
                  (walletTo && walletTo.id === cur.id
                    ? "bg-indigo-500"
                    : "text-indigo-500")
                }
                onClick={() => setWalletTo(cur)}
              >
                {cur.name}
              </button>
            ))}
          </div>
          {walletTo ? (
            <div className="flex justify-between items-center">
              <span className="font-medium">
                Balance: {walletTo.symbol}
                {wallets[walletTo.id]}
              </span>
              <span className="text-gray-600">
                +
                <input
                  type="number"
                  step="0.1"
                  onChange={onChangeAmountTo}
                  value={amountTo}
                  className="ml-2 w-28 h-10 border border-gray-400 focus:border-indigo-500 px-4 py-2 rounded-md outline-none"
                ></input>
              </span>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              Select your currency to exchange
            </p>
          )}
        </div>
        <button
          onClick={exchange}
          className={
            "w-full px-4 py-3 text-white font-semibold rounded-lg uppercase " +
            (isAvailableExchange
              ? "bg-green-500"
              : "bg-gray-400 cursor-not-allowed")
          }
          disabled={!isAvailableExchange}
        >
          Exchange
        </button>
      </div>
      <p className="fixed bottom-0 pb-4 text-gray-500 text-sm">Created by Duc Thai - 6.Nov.2021</p>
    </div>
  );
}

export default App;
