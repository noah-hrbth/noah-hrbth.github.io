import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './screens/Home';
import About from './screens/About';
import Contact from './screens/Contact';
import Header from './components/Header';
import Cursor from './components/Cursor';
import Background from './components/Background';

import './styles/_index.scss';

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
