import { BrowserRouter, Routes, Route } from 'react-router';
import { BlobColorsProvider } from './contexts/BlobColorsContext';
import { DELAY, getDelay, hasEntrancePlayed } from './constants';
import Home from './screens/Home/Home';
import Projects from './screens/Projects/Projects';
import Contact from './screens/Contact/Contact';
import Header from './components/Header/Header';
import Background from './components/Background/Background';
import Cursor from './components/Cursor/Cursor';

import './styles/index.scss';

function App() {
	const skipEntrance = hasEntrancePlayed();

	return (
		<BrowserRouter>
			<BlobColorsProvider>
				<div className={'app'}>
					<Background />
					<Cursor />
					<div
						className='layout'
						style={{ animationDelay: getDelay(DELAY.LAYOUT, skipEntrance) }}
					>
						<Header />

						<Routes>
							<Route path='/' element={<Home />} />
							<Route path='/projects' element={<Projects />} />
							<Route path='/contact' element={<Contact />} />
						</Routes>
					</div>
				</div>
			</BlobColorsProvider>
		</BrowserRouter>
	);
}

export default App;
