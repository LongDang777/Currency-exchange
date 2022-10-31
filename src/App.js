import './App.css';
import Exchange from './exchange/Exchange';

function App() {
  return (
    <div className="w-full h-screen flex items-center flex-col py-10 bg-gradient-to-br from-pink-100 to-orange-100 ">
       <Exchange/>
       <p className='absolute bottom-0 left-50 text-gray-500'>Tenomad Exchange Amount 31/10/2022</p>
    </div>
  );
}

export default App;
