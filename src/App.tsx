import { BrowserRouter, Routes, Route } from 'react-router';
import { NavigationProvider } from './contexts/NavigationContext';
import Home from './screens/Home/Home';
import About from './screens/About/About';
import Contact from './screens/Contact/Contact';
import Header from './components/Header/Header';
import Background from './components/Background/Background';
import TerminalInput from './components/TerminalInput/TerminalInput';

import './styles/index.scss';

function App() {
	return (
		<BrowserRouter>
			<NavigationProvider>
				<div className={'app'}>
					<Background />
					<div className={'layout'}>
						<Header />

						<Routes>
							<Route path='/' element={<Home />} />
							<Route path='/about' element={<About />} />
							<Route path='/contact' element={<Contact />} />
						</Routes>

						<TerminalInput />
					</div>

					{/* <Cursor /> */}
				</div>
			</NavigationProvider>
		</BrowserRouter>
	);
}

export default App;
