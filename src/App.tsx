import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './screens/Home/Home';
import About from './screens/About/About';
import Contact from './screens/Contact/Contact';
import Header from './components/Header/Header';
import Cursor from './components/Cursor/Cursor';
import Background from './components/Background/Background';

import './styles/index.scss';

function App() {
	return (
		<BrowserRouter>
			<div className={'app'}>
				<Background />
				<div className={'layout'}>
					<Header />

					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/about' element={<About />} />
						<Route path='/contact' element={<Contact />} />
					</Routes>
				</div>

				<Cursor />
			</div>
		</BrowserRouter>
	);
}

export default App;
