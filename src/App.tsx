
import './App.css';
import PcPage from './PC/PcPage';
import MobilePage from './mobile/MobilePage';
import { useRWD } from './useRWD';

function App(): JSX.Element {
  let device = useRWD();
  switch (device) {
    case 'PC': return <PcPage/>;
    case 'mobile': return <MobilePage/>;
  }
}



export default App;
