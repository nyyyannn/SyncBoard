import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Editor from "../pages/Editor";


const AppRoutes = () => {
  return (
    <Router>
        <Routes>
            <Route path='/login' element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/editor/:id' element={<Editor/>}/>
        </Routes>
    </Router>
  )
}

export default AppRoutes;