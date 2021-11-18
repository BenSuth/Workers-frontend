import Post from "./components/Post"
import Create from "./components/Create"
import { Navbar } from "react-bootstrap";
import "./stylesheets/index.css"

const App = () => {
  return (
    <div className="App">
      <div className="center">
        <div className="center-text">
            Social Media App
        </div>
        <Navbar>
          <div className="post-width">
            <Create/>
          </div>
        </Navbar>
        <Post/>
      </div>
    </div>
  );
}

export default App;
