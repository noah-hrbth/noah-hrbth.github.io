import { BrowserRouter, Routes, Route } from 'react-router';
import { NavigationProvider } from './contexts/NavigationContext';
import { BlobColorsProvider } from './contexts/BlobColorsContext';
import { hasEntrancePlayed } from './constants';
import Home from './screens/Home/Home';
import About from './screens/About/About';
import Contact from './screens/Contact/Contact';
import Header from './components/Header/Header';
import Background from './components/Background/Background';

import './styles/index.scss';

function App() {
	const skipEntrance = hasEntrancePlayed();

	return (
		<BrowserRouter>
			<NavigationProvider>
				<BlobColorsProvider>
					<div className={'app'}>
						<Background />
						<div className={`layout${skipEntrance ? ' layout--skip-entrance' : ''}`}>
							<Header />

							<Routes>
								<Route path='/' element={<Home />} />
								<Route path='/about' element={<About />} />
								<Route path='/contact' element={<Contact />} />
							</Routes>
						</div>
					</div>
				</BlobColorsProvider>
			</NavigationProvider>
		</BrowserRouter>
	);
}

export default App;
