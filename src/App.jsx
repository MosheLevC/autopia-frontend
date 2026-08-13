import Header from "./components/Header";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <div className="app-container" dir="rtl">
      <Header />
      <Navbar />
      <main>
        <HomePage />
      </main>
    </div>
  );
}

export default App;
