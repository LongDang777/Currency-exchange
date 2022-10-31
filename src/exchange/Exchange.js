import React, { useEffect, useMemo, useState } from 'react'
import { getAPI } from './api';
import { INIT_WALLETS, CURRENCY } from './data'

import { activeBtnClass, btnClass, btnExchange, content, contentInput, contentItem, inputClass } from './style'
import icon from './arrows.png'

export default function Exchange() {
  const [wallets, setWallets] = useState(INIT_WALLETS);
  const [walletFrom, setWalletFrom] = useState()
  const [walletTo, setWalletTo] = useState();
  const [amountFrom, setAmountFrom] = useState();
  const [amountTo, setAmountTo] = useState();
  const [rate, setRate] = useState(1);
  const [loading, setLoading] = useState('');


  useEffect(() => {
    if (walletFrom && walletTo) getRate(walletFrom.id, walletTo.id);
  }, [walletFrom, walletTo]) // eslint-disable-line react-hooks/exhaustive-deps
  
  const getRate = async (from, to) => {
    setRate("---");
    setLoading(' animate-[loading_0.7s_ease-out_infinite]')

    if (from === to) {
      setLoading(' animate-[loading_0.7s_ease-out_infinite]')
      setRate(1);
      setAmountTo(formatNumber(amountTo));
    }
    const rate = await getAPI(from, to);
    if (rate) {
      setLoading('')
      setRate(rate);
      setAmountTo(formatNumber(rate * amountFrom));
    }
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

  const formatNumber = (value)=>{
    return Math.round(value*1000)/1000;
}

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

  const handleChangeFrom = (value) => {
    if (value < 0) value = '';
    setAmountFrom(formatNumber(value))
    setAmountTo(formatNumber(value * rate))
  }

  const handleChangeTo = (value) => {
    if (value < 0) value = '';
    setAmountTo(formatNumber(value))
    setAmountFrom(formatNumber(value / rate))
  }

  return (
    <div className={content}>
      <h1 className='text-4xl py-3'>Currency Exchange</h1>
      <div className={contentItem}>
        <div className='flex justify-around'>
          {CURRENCY.map((item) => (
            <button
              key={item.id}
              className={btnClass + (walletFrom?.id === item.id ? activeBtnClass : '')}
              onClick={() => setWalletFrom(item)}
            >
              {item.name}
            </button>
          ))}
        </div>

        {walletFrom ? (
          <div>
            <div className={contentInput}>
              <div className="font-medium">
                {walletFrom.symbol}
                {wallets[walletFrom.id]}
              </div>
              <div>
                -<input
                  value={amountFrom}
                  onChange={e => handleChangeFrom(e.target.value)}
                  type="number"
                  step='0.01'
                  className={inputClass +
                    (errorFrom
                      ? "border-red-400 border-2"
                      : "border-gray-400 focus:border-indigo-500 ")}
                ></input>
              </div>
              {errorFrom && (
                <p className="text-red-500 text-right text-sm pr-14 w-80 mt-2">
                  {errorFrom}
                </p>
              )}
            </div>
          </div>

        ) : (
          <div className="text-gray-300 text-sm my-5">
            Select your currency to exchange
          </div>
        )}
      </div>
      <div className="w-1/2 text-center px-5 py-1 rounded-lg border-white text-orange-500 bg-gray-700">
        {walletFrom && walletTo && (
          <span className='flex items-center'>
            <img className={'w-5 h-5 mr-3'+ (loading)} src={icon} alt="" />
            <p>{walletFrom?.symbol}1 = {walletTo?.symbol}
            {rate.toLocaleString('vi-VI')}</p>
          </span>
        )}
      </div>

      {/* bottom */}
      <div className={contentItem}>
        <div className='flex justify-around'>
          {CURRENCY.map((item) => (
            <button
              key={item.id}
              className={btnClass + (walletTo?.id === item.id ? activeBtnClass : '')}
              onClick={() => setWalletTo(item)}
            >
              {item.name}
            </button>
          ))}
        </div>

        {walletTo ? (
          <div className={contentInput}>
            <div className="font-medium">
              {walletTo.symbol}
              {wallets[walletTo.id]}
            </div>
            <div className="">
              +<input
                value={amountTo}
                onChange={e => handleChangeTo(e.target.value)}
                type="number"
                step="0.1"
                className={inputClass}
              ></input>
            </div>
          </div>
        ) : (
          <div className="text-gray-300 text-sm my-5">
            Select your currency to exchange
          </div>
        )}
      </div>

      <button className={btnExchange + (isAvailableExchange
              ? " bg-orange-500 text-white"
              : " bg-gray-400 text-gray-500 cursor-not-allowed")
      }
        disabled={!isAvailableExchange}
        onClick={exchange}
      >EXCHANGE</button>
    </div>
  )
}
