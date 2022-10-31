import axios from 'axios';

export const getAPI = async (from, to) =>{
  try {
    const res = await axios.get(`https://v6.exchangerate-api.com/v6/438ebc61b9b2f21ed1b63a2f/pair/${from}/${to}`);
    return res.data.conversion_rate;
  } catch (err){
    console.log(err.message);
  }
}
 